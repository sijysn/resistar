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
	"github.com/sijysn/resistar/backend/repository"
	"github.com/sijysn/resistar/backend/utility"
)

func (u *UsecaseRepository) AddGroup(ctx context.Context, input model.NewGroup) (*model.Result, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	if responseAccess.Status == auth.StatusUnauthorized {
		errorMessage := "認証されていません"
		return &model.Result{
			Message: errorMessage,
		}, nil
	}

	userID, err := utility.ParseStringToUint(input.UserID)
	if err != nil {
		return nil, err
	}
	getUserWithGroupsByIDInput := repository.GetUserWithGroupsByIDInput{
		UserID: userID,
	}
	dbUser, err := u.Repository.GetUserWithGroupsByID(getUserWithGroupsByIDInput)
	if err != nil {
		return nil, err
	}
	createGroupInput := repository.CreateGroupInput{
		Name: input.GroupName,
	}
	dbNewGroup, err := u.Repository.CreateGroup(createGroupInput)
	if err != nil {
		return nil, err
	}
	addUserAssociationInput := repository.AddUserAssociationInput{
		Group: dbNewGroup,
		User: dbUser,
	}
	err = u.Repository.AddUserAssociation(addUserAssociationInput)
	if err != nil {
		return nil, err
	}
	dbGroupID := dbNewGroup.ID
	session.Session.GroupID = &dbGroupID

	groupID := utility.ParseUintToString(dbGroupID)

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
		"userID":       userID,
		"groupID":      dbGroupID,
		"exp":          time.Now().AddDate(0, 1, 0).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	jwtToken, err := token.SignedString(signKey)
	if err != nil {
		panic(err)
	}

	createGroupLoginLogInput := repository.CreateGroupLoginLogInput{
		UserID:  userID,
		GroupID: dbGroupID,
		Token:   utility.SHA512(sessionToken),
	}
	err = u.Repository.CreateGroupLoginLog(createGroupLoginLogInput)
	if err != nil {
		return nil, err
	}

	responseAccess.SetCookie("jwtToken", jwtToken, false, time.Now().Add(24*time.Hour))
	responseAccess.SetCookie("groupID", groupID, false, time.Now().Add(24*time.Hour))
	responseAccess.Writer.WriteHeader(http.StatusOK)

	message := "グループを作成しました"
	return &model.Result{
		Message: message,
		Success: true,
	}, nil
}