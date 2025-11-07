# AR神戸研用webサイト構築

## 基本情報
* さくらのVPS OS:Ubuntu
* IPアドレス：153.126.136.122
* pass：yak1s0ba
* 公開ディレクトリ：/var/www/html
* ローカルフォルダ名：poster

## AR-poster
### 注意事項
* VPS側の /var/www/html/ に書き込み権限がないためホームディレクトリにアップロート→サーバ側で移動（もしくはhtmlの権限を変更してもいい）
* カメラ使用はHTTPSでないと許可されないためSSL証明書を利用
* SSL発行にはドメインが必要

### 初期設定
ドメイン取得、SSL証明書発行、データ送信

1. ローカルフォルダをホームディレクトリに送る\
`scp -r poster ubuntu@153.126.136.122:~/`

2. 必要なソフトウェアのインストール\
`sudo apt update`\
`sudo apt install nginx`

    * WebサーバはNginxを利用(HTML/CSSだけの静的サイトの場合)
    * nginx のデフォルト公開ディレクトリは `/var/www/html`

3. VPSにSSH接続して、ファイルを移動
    1. SSH接続\
    `ssh ubuntu@153.126.136.122`
    2. 管理者として移動\
    `sudo mv ~/poster /var/www/html/`
    3. 所有者と権限を適切に設定（Nginxが読み込めるように）\
    `sudo chown -R www-data:www-data /var/www/html/poster`
    `sudo chmod -R 755 /var/www/html/poster`

4. ドメイン取得
    1. [DuckDNS](https://www.duckdns.org/ )にアクセス(無料ドメインならなんでもいい。DuckDNSを利用した。)
    2. kambeken@gmail.comでログイン
    3. "ar-kambeken"で**add domain**
    4. VPSのIPアドレスをDuckDNSに登録\
    current ipを`153.126.136.122`に変更し、**update ip**

5. Nginx にドメイン名を設定
    1. Nginxの設定ファイルを編集\
    `sudo nano /etc/nginx/sites-available/default`
    * 変更前
        > server {\
        > listen 80 default_server;\
        > listen [::]:80 default_server;\
        > server_name _;
    * 変更後
        > server {\
        > listen 80 default_server;\
        > listen [::]:80 default_server;\
        > server_name ar-kambeken.duckdns.org;
        ```
        編集が終わったら、キーボードで：

        Ctrl + O（＝「書き込み」＝保存）
        → 下に File Name to Write: /etc/nginx/sites-available/default と表示されるので、そのまま Enter

        Ctrl + X（＝「終了」）
        ```

    2. Nginx 設定をテスト・再起動\
    `sudo nginx -t` ← 設定ファイルにエラーがないか確認\
    `sudo systemctl reload nginx`← 反映（再起動より速くて安全）

6. 証明書の発行と適用\
`sudo apt install certbot python3-certbot-nginx`\
`sudo certbot --nginx -d ar-kambeken.duckdns.org`

    * 実行中に表示される確認事項（前に入力済みならスキップされるかも）
        * 証明書更新などの通知を受け取るメールアドレス:kambeken@gmail.com
            >Saving debug log to /var/log/letsencrypt/letsencrypt.log
            >Plugins selected: Authenticator nginx, Installer nginx
            >Enter email address (used for urgent renewal and security notices) (Enter 'c' to cancel): 

        * 利用規約：`A`(同意)を入力してEnter
            >Please read the Terms of Service at
            >https://letsencrypt.org/documents/LE-SA-v1.5-February-24-2025.pdf. You must
            >agree in order to register with the ACME server at
            >https://acme-v02.api.letsencrypt.org/directory

        * EFFの案内：→ `N`（不要）を入力してEnter
            >Would you be willing to share your email address with the Electronic Frontier
            >Foundation, a founding partner of the Let's Encrypt project and the non-profit
            >organization that develops Certbot? We'd like to send you email about our work
            >encrypting the web, EFF news, campaigns, and ways to support digital freedom.

        * リダイレクト設定：HTTPSへ常時リダイレクトが必要なため`2`を入力しEnter

    * コマンド実行後に以下のような表示が出れば成功
        >Congratulations! You have successfully enabled HTTPS on https://yourdomain.duckdns.org

    * 証明書情報の表示\
    `sudo certbot certificates`

### 証明書の再発行
    ```
    sudo certbot renew --force-renewal
    sudo systemctl reload nginx
    ```

### ブラウザで以下にアクセス
https://ar-kambeken.duckdns.org/poster/