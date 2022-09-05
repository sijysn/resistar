GraphQLの型を変更
```
go get -d github.com/99designs/gqlgen && go run github.com/99designs/gqlgen generate
```

GraphQLサーバーを立ち上げる
```
go run server.go
```

鍵を生成
```
ssh-keygen -t rsa -f jwt.pem -m pem
ssh-keygen -f jwt.pem.pub -e -m pkcs8 > jwt.pem.pub.pkcs8
```