package utility

import (
	"crypto/rand"
	"crypto/sha512"
	"fmt"
	"strconv"
)

func ParseStringToUint(str string) (uint, error) {
	parsed, err := strconv.ParseUint(str, 10, 64)
	if err != nil {
		return 0, err
	}
	return uint(parsed), nil
}

func ParseUintToString(n uint) string {
	return strconv.FormatUint(uint64(n), 10)
}

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

