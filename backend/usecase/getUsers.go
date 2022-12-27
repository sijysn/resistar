package usecase

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/middleware"
	"github.com/sijysn/resistar/backend/repository"
)

func(u *UsecaseRepository) GetUsers(ctx context.Context, input model.UsersQuery) ([]*model.User, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	var users []*model.User
	if responseAccess.Status != auth.StatusGroup {
		errorMessage := "認証されていません"
		users = append(users, &model.User{
			ErrorMessage: &errorMessage,
		})
		return users, nil
	}
	groupID, err := strconv.ParseUint(input.GroupID, 10, 64)
	if err != nil {
		return nil, err
	}
	getUsersInput := repository.GetUsersInput{
		GroupID: uint(groupID),
	}
	dbUsers, err := u.Repository.GetUsers(getUsersInput)
	for _, dbUser := range dbUsers {
		users = append(users, &model.User{
			ID:       strconv.FormatUint(uint64(dbUser.ID), 10),
			Email:    dbUser.Email,
			Name:     dbUser.Name,
			ImageURL: dbUser.ImageURL,
		})
	}
	if err != nil {
		return nil, err
	}
	return users, nil
}