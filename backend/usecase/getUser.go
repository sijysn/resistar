package usecase

import (
	"context"
	"fmt"
	"net/http"

	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/middleware"
	"github.com/sijysn/resistar/backend/repository"
	"github.com/sijysn/resistar/backend/utility"
)

func(u *UsecaseRepository) GetUser(ctx context.Context, input model.UserQuery) (*model.User, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	if responseAccess.Status != auth.StatusGroup {
		errorMessage := "認証されていません"
		return &model.User {
			ErrorMessage: &errorMessage,
		}, nil
	}
	userID, err := utility.ParseStringToUint(input.UserID)
	if err != nil {
		return nil, err
	}
	getUserInput := repository.GetUserInput{
		UserID: userID,
	}
	dbUser, err := u.Repository.GetUser(getUserInput)
	user := &model.User{
		ID:       utility.ParseUintToString(dbUser.ID),
		Email:    dbUser.Email,
		Name:     dbUser.Name,
		ImageURL: dbUser.ImageURL,
	}
	return user, nil
}