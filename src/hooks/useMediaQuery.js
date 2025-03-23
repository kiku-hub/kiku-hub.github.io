import { useState, useEffect } from "react";

/**
 * メディアクエリに基づいてデバイスタイプを検出するカスタムフック
 * @param {string} query - メディアクエリ文字列（例: "(max-width: 767px)"）
 * @returns {boolean} - クエリに一致するかどうか
 */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // SSR対応（windowがない場合は早期リターン）
    if (typeof window === "undefined") {
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
    mediaQuery.addEventListener("change", handleChange);

    // クリーンアップ関数
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery; 