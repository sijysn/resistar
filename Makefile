gqlgen:
	cd backend && \
	go get -d github.com/99designs/gqlgen && \
	go run github.com/99designs/gqlgen generate

go:
	cd backend && \
	go run cmd/**

ssh-keygen:
	cd backend && \
	ssh-keygen -t rsa -f jwt.pem -m pem
	ssh-keygen -f jwt.pem.pub -e -m pkcs8 > jwt.pem.pub.pkcs8

next:
	cd frontend && \
	yarn dev