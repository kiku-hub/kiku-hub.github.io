import { useState, useEffect } from "react";

/**
 * メディアクエリに基づいてデバイスタイプを検出するカスタムフック
 * @param {string} query - メディアクエリ文字列（例: "(max-width: 767px)"）
 * @returns {boolean} - クエリに一致するかどうか
 */
function useMediaQuery(query) {
  // 初期値をモバイル判定に設定（User-Agentに基づく）
  const isMobileByUserAgent = () => {
    if (typeof window === "undefined" || !window.navigator) return false;
    
    const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
    return /android|iPad|iPhone|iPod|webOS|BlackBerry|Windows Phone/i.test(userAgent);
  };

  const getInitialValue = () => {
    if (typeof window === "undefined") return false;
    if (query === "(max-width: 767px)" && isMobileByUserAgent()) return true;
    return window.matchMedia ? window.matchMedia(query).matches : false;
  };

  const [matches, setMatches] = useState(getInitialValue);

  useEffect(() => {
    // SSR対応（windowがない場合は早期リターン）
    if (typeof window === "undefined") {
      return;
    }

    // ブラウザがmatchMediaをサポートしていない場合
    if (!window.matchMedia) {
      console.warn("Browser doesn't support matchMedia");
      // モバイル判定の場合はUser-Agentを使用
      if (query === "(max-width: 767px)") {
        setMatches(isMobileByUserAgent());
      }
      return;
    }

    const mediaQuery = window.matchMedia(query);

    // 初期値を設定
    setMatches(mediaQuery.matches);

    // メディアクエリの変更を検出するリスナー
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // イベントリスナーを追加
    try {
      // モダンなブラウザ
      mediaQuery.addEventListener("change", handleChange);
    } catch (err) {
      try {
        // 古いブラウザ（Safari 13.1以前など）
        mediaQuery.addListener(handleChange);
      } catch (e) {
        console.warn("Browser doesn't support media query listeners", e);
      }
    }

    // クリーンアップ関数
    return () => {
      try {
        // モダンなブラウザ
        mediaQuery.removeEventListener("change", handleChange);
      } catch (err) {
        try {
          // 古いブラウザ
          mediaQuery.removeListener(handleChange);
        } catch (e) {
          console.warn("Error cleaning up media query listeners", e);
        }
      }
    };
  }, [query]);

  return matches;
}

export default useMediaQuery; 