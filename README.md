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
ネームサーバー・プロキシは[cloudflare](https://www.cloudflare.com/)
  
ドメイン管理は[ムームードメイン](https://muumuu-domain.com/)

## deploy
### backend
[render.com](https://render.com/)
  
mainブランチにマージすると、自動でデプロイされる

### frontend
[netlify](https://www.netlify.com/)
  
mainブランチにマージすると、自動でデプロイされる
