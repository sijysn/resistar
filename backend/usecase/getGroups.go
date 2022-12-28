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

	userID, err := utility.ParseStringToUint(input.UserID)
	if err != nil {
		return nil, err
	}
	GetUserByIDInput := repository.GetUserByIDInput{
		UserID: userID,
	}
	dbUser, err := u.Repository.GetUserByID(GetUserByIDInput)
	if err != nil {
		return nil, err
	}

	for _, dbGroup := range dbUser.Groups {
		// 所属しているグループのメンバーを取得する
		var myGroupUsers []*model.User
		GetGroupWithUsersByIDInput := repository.GetGroupWithUsersByIDInput{
			GroupID: dbGroup.ID,
		}
		dbMyGroup, err := u.Repository.GetGroupWithUsersByID(GetGroupWithUsersByIDInput)
		if err != nil {
			return nil, err
		}
		for _, dbMyGroupUser := range dbMyGroup.Users {
			myGroupUsers = append(myGroupUsers, &model.User{
				ID:    utility.ParseUintToString(dbMyGroupUser.ID),
				Email: dbMyGroupUser.Email,
				Name:  dbMyGroupUser.Name,
			})
		}

		groups = append(groups, &model.Group{
			ID:    utility.ParseUintToString(dbGroup.ID),
			Name:  dbGroup.Name,
			Users: myGroupUsers,
		})
	}
	return groups, nil
}