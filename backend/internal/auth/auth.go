package auth

import (
	"context"
	"net/http"
	"time"

	"gorm.io/gorm"
)

type key string
var ResponseAccessKey key

type ResponseAccess struct {
	Writer http.ResponseWriter
}

func (r *ResponseAccess) SetCookie(name string, value string, httpOnly bool, expires time.Time) {
	// env := os.Getenv("ENV")
	http.SetCookie(r.Writer, &http.Cookie{
		Name: name,
		Value: value,
		HttpOnly: httpOnly,
		// Secure: env == "production" || env == "staging",
		Secure: true,
		SameSite: http.SameSiteNoneMode,
		Domain: "resistar.net",
    Expires: time.Now().Add(24 * time.Hour),
	})
}
func Middleware(db *gorm.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// jwtToken, err := r.Cookie("jwt-token")
			// if err != nil || jwtToken == nil {
			// 	next.ServeHTTP(w, r)
			// 	return
			// }
			
			responseAccess := ResponseAccess{
				Writer: w,
			}

			ctx := context.WithValue(r.Context(), ResponseAccessKey, &responseAccess)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}