package usecase

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/middleware"
	"github.com/sijysn/resistar/backend/internal/session"
	"github.com/sijysn/resistar/backend/utility"
)

func (u *UsecaseRepository) LogoutGroup(ctx context.Context) (*model.Result, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	if responseAccess.Status != auth.StatusGroup {
		errorMessage := "認証されていません"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}
	signBytes, err := ioutil.ReadFile("./jwt.pem")
	if err != nil {
		panic(err)
	}
	session.Session.GroupID = nil

	signKey, err := jwt.ParseRSAPrivateKeyFromPEM(signBytes)
	if err != nil {
		panic(err)
	}

	sessionToken := utility.GenerateToken()
	claims := jwt.MapClaims{
		"sessionToken": sessionToken,
		"userID":       &session.Session.UserID,
		"exp":          time.Now().AddDate(0, 1, 0).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	jwtToken, err := token.SignedString(signKey)
	if err != nil {
		panic(err)
	}
	responseAccess.SetCookie("jwtToken", jwtToken, false, time.Now().Add(24*time.Hour))
	responseAccess.DeleteCookie("groupID")
	responseAccess.Writer.WriteHeader(http.StatusOK)

	message := "グループからログアウトしました"
	return &model.Result{
		Message: message,
		Success: true,
	}, nil
}