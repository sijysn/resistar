package digest

import (
	"crypto/rand"
	"crypto/sha512"
	"fmt"
)

func GenerateToken() string {
	token := make([]byte, 32)
	rand.Read(token)
	return fmt.Sprintf("%x", token)
}

func GenerateSignKey() []byte {
	token := make([]byte, 32)
	rand.Read(token)
	return token
}

func SHA512(password string) string {
	b := []byte(password)
	hash := sha512.Sum512(b)
	return fmt.Sprintf("%x", hash)
}

