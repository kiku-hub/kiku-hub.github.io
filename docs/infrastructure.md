# インフラストラクチャー設定ドキュメント

## システム概要

### 現在の環境

- ドメイン → さくらインターネット（ドメイン管理のみ）
- DNS → Cloudflare DNS
- Web ホスティング → GitHub Pages（kiku-hub.github.io）
- CDN/セキュリティ → Cloudflare
- メールサーバー → Google Workspace
- フォーム処理 → Google Apps Script

### アーキテクチャ概要

```
[ユーザー]
    ↓
[Cloudflare DNS] → DNSクエリ解決/CDN/セキュリティ
    ↓
[GitHub Pages] → Webホスティング
    ↓
[Google Workspace] → メール配信
    ↓
[Google Apps Script] → フォーム処理
```

## DNS 設定

### さくら DNS での設定

```
現状：
- ドメイン（orcx.co.jp）は取得済み
- 現在のネームサーバーはさくらのデフォルト設定
  ns1.dns.ne.jp
  ns2.dns.ne.jp

ネームサーバー設定手順：
1. Cloudflareでドメインを追加し、Cloudflareのネームサーバーのアドレスをメモしておく
   （例：chad.ns.cloudflare.com、katya.ns.cloudflare.com）

2. さくらのコントロールパネルにログイン

3. 「ドメイン設定」→「ネームサーバー設定」を選択
   注意: さくらのデフォルトネームサーバーから変更する必要があります

4. Cloudflareから提供された2つのネームサーバーを入力
   - プライマリ: [Cloudflareの1つ目のNS]
   - セカンダリ: [Cloudflareの2つ目のNS]

5. 変更を保存

6. DNS の伝播を待つ（最大 48 時間、通常は数時間）

メール設定（Google Workspace 用）：
MX: 1 SMTP.GOOGLE.COM
TXT: v=spf1 include:\_spf.google.com ~all
TXT: google-site-verification=4DAb8XEDaLdK4IRykZJ9mXKFxGK2_VeK7rkUwXO7xyk

5. 変更を保存

6. DNS の伝播を待つ（最大 48 時間、通常は数時間）
   メール設定（Google Workspace 用）
   CopyMX: 1 SMTP.GOOGLE.COM
   TXT: v=spf1 include:\_spf.google.com ~all
   TXT: google-site-verification=4DAb8XEDaLdK4IRykZJ9mXKFxGK2_VeK7rkUwXO7x

```

### Cloudflare での設定

1. DNS レコード

```

# A レコード（GitHub Pages 用）

A: @ → 185.199.108.153
A: @ → 185.199.109.153
A: @ → 185.199.110.153
A: @ → 185.199.111.153

# www サブドメイン用

CNAME: www → kiku-hub.github.io

```

2. SSL/TLS 設定

```

- 暗号化モード: Full
- Always Use HTTPS: ON
- Auto Minify: CSS/JavaScript/HTML
- Brotli: ON

```

## アクセスフロー

### Web アクセスの流れ

1. ユーザーがwww.orcx.co.jpにアクセス
2. Cloudflare DNS がクエリを解決し、CDN を経由
3. Cloudflare が GitHub Pages にリクエストを転送
4. GitHub Pages がコンテンツを提供

### メール配信の流れ

1. 送信者がメールを送信
2. MX レコードにより、Google Workspace に転送
3. SPF 認証による検証
4. 受信者のメールボックスに配信

### お問い合わせフォームの流れ

1. ユーザーがフォームを送信
2. Google Apps Script のエンドポイントにデータを送信
3. GAS がフォームデータを処理
4. Google Workspace を通じて指定のメールアドレスに送信

## セキュリティ設定

### Cloudflare

- WAF（Web Application Firewall）設定
- DDoS 保護
- ブラウザキャッシュ TTL 設定
- セキュリティレベル設定

### GitHub Pages

- 2 要素認証の有効化
- デプロイキーの管理
- アクセス権限の管理

### Google Workspace

- 2 段階認証の必須化
- フィッシング対策
- 暗号化通信の強制
- セキュリティキーの設定

### Google Apps Script

- デプロイされた Web アプリの適切なアクセス制限
- CORS の設定
- フォームデータのバリデーション
- レート制限の実装
- エラーログの記録

## トラブルシューティング

### DNS 設定の確認

```bash
# Aレコードの確認
dig orcx.co.jp A

# CNAMEレコードの確認
dig www.orcx.co.jp CNAME

# MXレコードの確認
dig orcx.co.jp MX

# TXTレコードの確認
dig orcx.co.jp TXT
```

### 一般的な問題と対処

1. Web サイトにアクセスできない

   - Cloudflare の DNS 設定確認
   - Cloudflare のステータス確認
   - GitHub Pages のステータス確認

2. HTTPS エラー

   - SSL/TLS 設定の確認
   - 証明書の有効期限確認
   - Mixed Content の確認

3. メールの問題

   - DNS 設定の確認
   - SPF レコードの確認
   - Google Workspace の設定確認

4. フォーム送信の問題
   - GAS のデプロイ状態の確認
   - CORS の設定確認
   - エラーログの確認
   - クォータ制限の確認

## 定期メンテナンス手順

### 週次チェック

```
1. SSL証明書の状態確認
2. DNSレコードの確認
3. セキュリティアラートの確認
4. パフォーマンスメトリクスの確認
```

### 月次メンテナンス

```
1. セキュリティパッチの適用
2. バックアップの検証
3. アクセスログの分析
4. パフォーマンス最適化
```

### 四半期メンテナンス

```
1. セキュリティ設定の見直し
2. アクセス権限の監査
3. バックアップ戦略の見直し
4. パフォーマンス改善の検討
```

## バックアップ体制

### コードバックアップ

```
1. GitHubリポジトリのミラー作成
2. 定期的なローカルクローン
3. 重要な設定ファイルの保管
```

### DNS 設定バックアップ

```
1. Cloudflare設定のエクスポート
2. 設定変更履歴の保管
```

### メールバックアップ

```
1. Google Workspaceバックアップの設定
2. 重要メールのローカルバックアップ
3. メーリングリスト設定のバックアップ
```

## 参考リンク

- [GitHub Pages Documentation](https://docs.github.com/ja/pages)
- [Cloudflare Documentation](https://developers.cloudflare.com/fundamentals/)
- [さくらの DNS 設定ガイド](https://help.sakura.ad.jp/hc/ja/articles/115000013681)
- [Google Workspace 管理コンソール](https://admin.google.com)
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
