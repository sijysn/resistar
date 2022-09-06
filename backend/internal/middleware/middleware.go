package middleware

import (
	"context"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/sijysn/resistar/backend/internal/digest"
	"github.com/sijysn/resistar/backend/internal/model"
	"github.com/sijysn/resistar/backend/internal/session"
	"gorm.io/gorm"
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

func Middleware(db *gorm.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// verifyBytes, err := ioutil.ReadFile("./jwt.pem.pub.pkcs8")
			// if err != nil {
			// 		panic(err)
			// }
			// verifyKey, err := jwt.ParseRSAPublicKeyFromPEM(verifyBytes)
			// if err != nil {
			// 		panic(err)
			// }
		
			// token, err := request.ParseFromRequest(r, request.AuthorizationHeaderExtractor, func(token *jwt.Token) (interface{}, error) {
      //   if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			// 		return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			// 	}
      //   return verifyKey, nil
			// })
			// responseAccess := ResponseAccess{
			// 	Writer: w,
			// 	Status: getStatus(token, r, err),
			// }

			responseAccess := ResponseAccess{
				Writer: w,
				Status: getStatus(r, db),
			}
			ctx := context.WithValue(r.Context(), ResponseAccessKey, &responseAccess)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

// func getStatus(token *jwt.Token, r *http.Request, err error) int {
// 	if err != nil  {
// 		return http.StatusUnauthorized
// 	}
// 	claims, ok := token.Claims.(jwt.MapClaims);
// 	if !ok {
// 		return http.StatusInternalServerError
// 	}
// 	sessionValid :=	session.Session.SessionToken == claims["sessionToken"]
// 	userIDValid := session.Session.UserID == uint(claims["userID"].(float64))
// 	groupIDValid := session.Session.GroupID == uint(claims["groupID"].(float64))
// 	if sessionValid && userIDValid && groupIDValid {
// 		return http.StatusOK
// 	} 
// 	return http.StatusUnauthorized 
// }

func getStatus(r *http.Request, db *gorm.DB) int {
	sessionToken, err := r.Cookie("sessionToken")
	if err != nil  {
		return http.StatusUnauthorized
	}
	accessToken, err := r.Cookie("accessToken")
	if err != nil  {
		return http.StatusUnauthorized
	}
	userIDString, err := r.Cookie("userID")
	if err != nil  {
		return http.StatusUnauthorized
	}
	userID, err := strconv.ParseUint(userIDString.Value, 10, 64)
	if err != nil {
		return http.StatusUnauthorized
	}
	groupIDString, err := r.Cookie("groupID")
	if err != nil  {
		return http.StatusUnauthorized
	}
	groupID, err := strconv.ParseUint(groupIDString.Value, 10, 64)
	if err != nil {
		return http.StatusUnauthorized
	}
	sessionValid :=	session.Session.SessionToken == sessionToken.Value
	userIDValid := session.Session.UserID == uint(userID)
	groupIDValid := session.Session.GroupID == uint(groupID)
	var dbLoginLogs []*model.LoginLog
	err = db.Where("access_token = ? AND user_id = ? AND group_id = ?", digest.SHA512(accessToken.Value), uint(userID), uint(groupID)).Find(&dbLoginLogs).Error
	if err != nil {
		return http.StatusUnauthorized
	}
	if len(dbLoginLogs) != 1 {
		return http.StatusUnauthorized
	}
	if sessionValid && userIDValid && groupIDValid {
		return http.StatusOK
	} 
	return http.StatusUnauthorized 
}