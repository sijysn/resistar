|tool|version|
|-|-|
|yarn|1.22.10|
|node|16.15.1|
|go|1.17.5|
|postgres|15|

　
## 開発環境
1. APIサーバを立ち上げる
```
make go
```

2. nextサーバを立ち上げる
```
make next
```

## DNS
ネームサーバー・プロキシはcloudflare
ドメイン管理はムームードメイン

## deploy
### backend
render.com
mainブランチにマージすると、自動でデプロイされる

### frontend
netlify
mainブランチにマージすると、自動でデプロイされる