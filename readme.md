# AR音声案内

## Detail
スマートフォンでポスターを読み込むと、対応する音声を再生できるWebARアプリ

## 使用ライブラリ
* three.js: 3D描画ライブラリ
* mind-ar: ARマーカートラッキングライブラリ（MindAR.js）



## ローカルフォルダ構成
```
index.html
targets.mind
generate_priject.js（アップロード不要）
assets/
  ├── audio/
  │     ├── aiu.mp3
  │     ├── 123.mp3
  │     └── list.js
  └── images/（アップロード不要）
        ├── poster0.png
        └── poster37.png

```

## 作業
1. 下記URLからtargets.mindファイルを作成（画像は100枚まで利用可能）
https://hiukim.github.io/mind-ar-js-doc/tools/compile
* imagesの順番とaudioのファイルのターゲットが一致している必要あり

2. list.js作成
`node generate_project.js`
* aidio直下に配置される。
```
[
  { "target": 0, "file": "greeting.mp3" },
  { "target": 1, "file": "lesson_intro.mp3" },
  { "target": 2, "file": "bgm1.mp3" }
]
```

3. ローカルフォルダをホームディレクトリに送る\
`scp -r ファイル名 ubuntu@153.126.136.122:~/`
* password:yak1s0ba

4. VPSにSSH接続して、ファイルを移動
    1. SSH接続\
    `ssh ubuntu@153.126.136.122`
    2. 管理者として移動\
    `sudo mv ~/ファイル名 /var/www/html/`
    3. 所有者と権限を適切に設定（Nginxが読み込めるように）\
    `sudo chown -R www-data:www-data /var/www/html/ファイル名`
    `sudo chmod -R 755 /var/www/html/ファイル名`


### ブラウザで以下にアクセス
https://ar-kambeken.duckdns.org/ファイル名/

### 証明書の再発行
```
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```