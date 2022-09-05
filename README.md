|tool|version|
|-|-|
|yarn|1.22.10|
|node|16.15.1|
|go|1.17.5|

　
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
productionブランチで行う
（productionブランチはgithubにプッシュしない）

1. ```git switch production``` 
2. .gitignoreを修正する
3. ```yarn deploy-backend```
