const CACHE_NAME = 'orcx-cache-v1';
const STATIC_ASSETS = [
  '/models/',
  '/images/',
  '/static/',
  '/assets/'
];

// インストール時のキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// キャッシュの利用とネットワークフォールバック
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
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
      });
    })
  );
}); 