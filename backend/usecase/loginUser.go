package usecase

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-ozzo/ozzo-validation/is"
	"github.com/golang-jwt/jwt"
	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/digest"
	"github.com/sijysn/resistar/backend/internal/middleware"
	"github.com/sijysn/resistar/backend/internal/session"
	"github.com/sijysn/resistar/backend/repository"
	"github.com/sijysn/resistar/backend/utility"
)

func(u *UsecaseRepository) LoginUser(ctx context.Context, input model.LoginUser) (*model.Result, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	
	err := validation.Validate(
		input.Email,
		validation.Required,
		validation.Length(5, 100),
		is.Email,
	)
	if err != nil {
		return nil, err
	}

	// ユーザーが存在するかチェックする
	getUserByEmailAndPasswordInput := repository.GetUserByEmailAndPasswordInput{
		Email: input.Email,
		Password: input.Password,
	}
	users, err := u.Repository.GetUserByEmailAndPassword(getUserByEmailAndPasswordInput)
	if len(users) != 1 {
		errorMessage := "メールアドレスまたはパスワードが違います"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	sessionToken := digest.GenerateToken()
	user := users[0]
	userID := user.ID
	session.Session.SessionToken = &sessionToken
	session.Session.UserID = &userID

	signBytes, err := ioutil.ReadFile("./jwt.pem")
	if err != nil {
		panic(err)
	}

	signKey, err := jwt.ParseRSAPrivateKeyFromPEM(signBytes)
	if err != nil {
		panic(err)
	}

	claims := jwt.MapClaims{
		"sessionToken": sessionToken,
		"userID":       uint(userID),
		"exp":          time.Now().AddDate(0, 1, 0).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	jwtToken, err := token.SignedString(signKey)
	if err != nil {
		panic(err)
	}

	loginLogInput := repository.CreateUserLoginLogInput{
		UserID: userID,
		Token:  digest.SHA512(sessionToken),
	}
	err = u.Repository.CreateUserLoginLog(loginLogInput)
	if err != nil {
		return nil, err
	}

	responseAccess.SetCookie("jwtToken", jwtToken, false, time.Now().Add(24*time.Hour))
	id := utility.ParseUintToString(userID)
	responseAccess.SetCookie("userID", id, false, time.Now().Add(24*time.Hour))
	responseAccess.Writer.WriteHeader(http.StatusOK)

	message := "ログインに成功しました"
	return &model.Result{
		Message: message,
		Success: true,
	}, nil
}