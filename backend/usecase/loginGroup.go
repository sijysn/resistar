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
	"github.com/sijysn/resistar/backend/repository"
	"github.com/sijysn/resistar/backend/utility"
)

func (u *UsecaseRepository) LoginGroup(ctx context.Context, input model.LoginGroup) (*model.Result, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}

	if responseAccess.Status == auth.StatusUnauthorized {
		errorMessage := "認証されていません"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	groupID, err := utility.ParseStringToUint(input.GroupID)
	if err != nil {
		return nil, err
	}

	getGroupByIDInput := repository.GetGroupByIDInput{
		GroupID: groupID,
	}
	// グループが存在するかチェックする
	dbGroup, err := u.Repository.GetGroupByID(getGroupByIDInput)
	if err != nil {
		errorMessage := "無効なグループです"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	// グループのメンバーかどうかチェックする
	userID, err := utility.ParseStringToUint(input.UserID)
	if err != nil {
		return nil, err
	}

	getGroupWithUsersByIDAndUserIDInput := repository.GetGroupWithUsersByIDAndUserIDInput{
		GroupID: groupID,
		UserID: userID,
	}
	dbGroup, err = u.Repository.GetGroupWithUsersByIDAndUserID(getGroupWithUsersByIDAndUserIDInput)
	if len(dbGroup.Users) != 1 {
		errorMessage := "このグループには入れません"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	signBytes, err := ioutil.ReadFile("./jwt.pem")
	if err != nil {
		panic(err)
	}

	signKey, err := jwt.ParseRSAPrivateKeyFromPEM(signBytes)
	if err != nil {
		panic(err)
	}

	sessionToken := utility.GenerateToken()
	claims := jwt.MapClaims{
		"sessionToken": sessionToken,
		"userID":       uint(userID),
		"groupID":      uint(groupID),
		"exp":          time.Now().AddDate(0, 1, 0).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	jwtToken, err := token.SignedString(signKey)
	if err != nil {
		panic(err)
	}

	createGroupLoginLogInput := repository.CreateGroupLoginLogInput{
		UserID:  userID,
		GroupID: groupID,
		Token:   utility.SHA512(sessionToken),
	}
	err = u.Repository.CreateGroupLoginLog(createGroupLoginLogInput)
	if err != nil {
		return nil, err
	}

	responseAccess.SetCookie("jwtToken", jwtToken, false, time.Now().Add(24*time.Hour))
	responseAccess.SetCookie("groupID", input.GroupID, false, time.Now().Add(24*time.Hour))
	responseAccess.Writer.WriteHeader(http.StatusOK)

	message := "グループにログインしました"
	return &model.Result{
		Message: message,
		Success: true,
	}, nil
}