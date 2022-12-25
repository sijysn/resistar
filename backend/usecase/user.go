package usecase

import (
	"context"
	"fmt"
	"net/http"

	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/middleware"
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
	users, err := u.Repository.GetUsers(input)
	if err != nil {
		return nil, err
	}
	return users, nil
}