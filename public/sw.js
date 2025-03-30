const CACHE_NAME = 'orcx-cache-v2';
const STATIC_ASSETS = [
  '/models/',
  '/images/',
  '/static/',
  '/assets/'
];

// エラーをキャッチする関数
const catchError = (error) => {
  console.error('Service worker error:', error);
  return new Response('Service Worker Error', {
    status: 500,
    headers: {'Content-Type': 'text/plain'}
  });
};

// インストール時のキャッシュ
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 即時アクティブ化
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(catchError)
  );
});

// 古いキャッシュの削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// キャッシュの利用とネットワークフォールバック
self.addEventListener('fetch', (event) => {
  // ソースマップリクエストをスキップ
  if (event.request.url.endsWith('.map')) {
    return;
  }

  // React DevToolsからのリクエストをスキップ
  if (event.request.url.includes('installHook.js') || 
      event.request.url.includes('react_devtools_backend')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュヒット時
        if (response) {
          return response;
        }

        // キャッシュミス時はネットワークリクエスト
        return fetch(event.request).then((response) => {
          // 無効なレスポンスの場合はそのまま返す
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // レスポンスをクローンしてキャッシュに保存
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // 画像とモデルのみをキャッシュ
            if (
              event.request.url.match(/\.(jpg|jpeg|png|gif|webp|glb|gltf)$/i) ||
              STATIC_ASSETS.some(path => event.request.url.includes(path))
            ) {
              cache.put(event.request, responseToCache);
            }
          });

          return response;
        }).catch(catchError);
      }).catch(catchError)
  );
}); 