package middleware

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/golang-jwt/jwt/request"
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/session"
	"github.com/sijysn/resistar/backend/repository"
	"github.com/sijysn/resistar/backend/utility"
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

func (r *ResponseAccess) DeleteCookie(name string) {
	cookie := &http.Cookie{
		Name: name,
		Value: "",
		HttpOnly: true,
		Secure: true,
		SameSite: http.SameSiteNoneMode,
    MaxAge: -1,
	}
	env := os.Getenv("ENV")
	if env == "production" {
		cookie.Domain = "resistar.net"
	}
	http.SetCookie(r.Writer, cookie)
}

func Middleware(repository repository.Queries) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			verifyBytes, err := ioutil.ReadFile("./jwt.pem.pub.pkcs8")
			if err != nil {
					panic(err)
			}
			verifyKey, err := jwt.ParseRSAPublicKeyFromPEM(verifyBytes)
			if err != nil {
					panic(err)
			}

			token, err := request.ParseFromRequest(r, request.AuthorizationHeaderExtractor, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
					return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
				}
				return verifyKey, nil
			})
			status := getStatus(repository, token, err)
			responseAccess := ResponseAccess{
				Writer: w,
				Status: status,
			}
			ctx := context.WithValue(r.Context(), ResponseAccessKey, &responseAccess)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

func getStatus(r repository.Queries, token *jwt.Token, err error) int {
	if err != nil  {
		return auth.StatusUnauthorized
	}
	claims, ok := token.Claims.(jwt.MapClaims);
	if !ok {
		return http.StatusInternalServerError
	}
	sessionToken := claims["sessionToken"]
	if sessionToken == nil {
		return auth.StatusUnauthorized
	}
	userID := claims["userID"]
	if userID == nil {
		return auth.StatusUnauthorized
	}
	groupID := claims["groupID"]
	if groupID == nil {
		getUserLoginLogInput := repository.GetUserLoginLogInput{
			Token: utility.SHA512(claims["sessionToken"].(string)),
			UserID: uint(claims["userID"].(float64)),
		}
		userLoginLog, err := r.GetUserLoginLog(getUserLoginLogInput)
		if err != nil {
			return http.StatusInternalServerError
		}
		if userLoginLog.CreatedAt.Before(time.Now().AddDate(-1, 0, 0)) {
			return auth.StatusUnauthorized
		}
		session.Session.UserID = &userLoginLog.UserID
		return auth.StatusUser
	}

	getGroupLoginLogInput := repository.GetGroupLoginLogInput{
		Token: utility.SHA512(claims["sessionToken"].(string)),
		UserID: uint(claims["userID"].(float64)),
		GroupID: uint(claims["groupID"].(float64)),
	}
	groupLoginLog, err := r.GetGroupLoginLog(getGroupLoginLogInput)
	if err != nil {
		return http.StatusInternalServerError
	}
	if groupLoginLog.CreatedAt.Before(time.Now().AddDate(-1, 0, 0)) {
		return auth.StatusUnauthorized
	}
	session.Session.UserID = &groupLoginLog.UserID
	session.Session.GroupID = &groupLoginLog.GroupID
	return auth.StatusGroup
}
