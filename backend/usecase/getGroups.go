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

func(u *UsecaseRepository) GetGroups(ctx context.Context, input model.GroupsQuery) ([]*model.Group, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	var groups []*model.Group
	if responseAccess.Status == auth.StatusUnauthorized {
		errorMessage := "認証されていません"
		groups = append(groups, &model.Group{
			ErrorMessage: &errorMessage,
		})
		return groups, nil
	}

	userID, err := strconv.ParseUint(input.UserID, 10, 64)
	if err != nil {
		return nil, err
	}
	GetUserByIDInput := repository.GetUserByIDInput{
		UserID: uint(userID),
	}
	dbUser, err := u.Repository.GetUserByID(GetUserByIDInput)
	if err != nil {
		return nil, err
	}

	for _, dbGroup := range dbUser.Groups {
		// 所属しているグループのメンバーを取得する
		var myGroupUsers []*model.User
		GetGroupByIDInput := repository.GetGroupByIDInput{
			GroupID: dbGroup.ID,
		}
		dbMyGroup, err := u.Repository.GetGroupByID(GetGroupByIDInput)
		if err != nil {
			return nil, err
		}
		for _, dbMyGroupUser := range dbMyGroup.Users {
			myGroupUsers = append(myGroupUsers, &model.User{
				ID:    strconv.FormatUint(uint64(dbMyGroupUser.ID), 10),
				Email: dbMyGroupUser.Email,
				Name:  dbMyGroupUser.Name,
			})
		}

		groups = append(groups, &model.Group{
			ID:    strconv.FormatUint(uint64(dbGroup.ID), 10),
			Name:  dbGroup.Name,
			Users: myGroupUsers,
		})
	}
	return groups, nil
}