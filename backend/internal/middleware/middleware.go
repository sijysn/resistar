package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/golang-jwt/jwt/request"
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/session"
)

var ResponseAccessKey string

type ResponseAccess struct {
	Writer http.ResponseWriter
	Status int
}

func (r *ResponseAccess) SetCookie(name string, value string, httpOnly bool, expires time.Time) {
	cookie := &http.Cookie{
		Name: name,
		Value: value,
		HttpOnly: httpOnly,
		Secure: true,
		SameSite: http.SameSiteNoneMode,
    Expires: time.Now().Add(24 * time.Hour),
	}
	env := os.Getenv("ENV")
	if env == "production" {
		cookie.Domain = "resistar.net"
	}
	http.SetCookie(r.Writer, cookie)
}

func Middleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			token, err := request.ParseFromRequest(r, request.AuthorizationHeaderExtractor, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
				}
        return auth.SignKey, nil
			})
			responseAccess := ResponseAccess{
				Writer: w,
				Status: getStatus(token, r, err),
			}
			ctx := context.WithValue(r.Context(), ResponseAccessKey, &responseAccess)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

func getStatus(token *jwt.Token, r *http.Request, err error) int {
	if err != nil  {
		return http.StatusUnauthorized
	}
	claims, ok := token.Claims.(jwt.MapClaims);
	if !ok {
		return http.StatusInternalServerError
	}
	sessionValid :=	session.Session.SessionToken == claims["sessionToken"]
	userIDValid := session.Session.UserID == uint(claims["userID"].(float64))
	groupIDValid := session.Session.GroupID == uint(claims["groupID"].(float64))
	if sessionValid && userIDValid && groupIDValid {
		return http.StatusOK
	} 
	return http.StatusUnauthorized 
}