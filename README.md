|tool|version|
|-|-|
|yarn|1.22.10|
|node|16.15.1|
|go|1.17.5|
|postgres|15|

　
## 開発環境
1. コンテナを立ち上げる
```
yarn docker
```

2. コンテナを止める
```
yarn docker-stop
```

## DNS
ネームサーバー・プロキシはcloudflareを使用している
ドメイン管理はムームードメインを使用している

## deploy
render.comを使用している
mainブランチにマージすると、自動でデプロイされる
