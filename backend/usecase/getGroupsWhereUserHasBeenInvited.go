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

func (u *UsecaseRepository) GetGroupsWhereUserHasBeenInvited(ctx context.Context, input model.GroupsQuery) ([]*model.Group, error) {
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
	getInvitedUsersByUserIDInput := repository.GetInvitedUsersByUserIDInput{
		UserID: userID,
	}
	dbInvitedUsers, err := u.Repository.GetInvitedUsersByUserID(getInvitedUsersByUserIDInput)
	if err != nil {
		return nil, err
	}
	if len(dbInvitedUsers) == 0 {
		return []*model.Group{}, nil
	}
	var dbGroupIDs []uint
	for _, dbInvitedUser := range dbInvitedUsers {
		if !dbInvitedUser.Joined {
			dbGroupIDs = append(dbGroupIDs, dbInvitedUser.GroupID)
		}
	}
	getGroupsByIDsInput := repository.GetGroupsByIDsInput{
		GroupIDs: dbGroupIDs,
	}
	dbGroups, err := u.Repository.GetGroupsByIDs(getGroupsByIDsInput)
	if err != nil {
		return nil, err
	}
	for _, dbGroup := range dbGroups {
		var users []*model.User
		for _, dbGroupUser := range dbGroup.Users {
			users = append(users, &model.User{
				ID:    utility.ParseUintToString(dbGroupUser.ID),
				Email: dbGroupUser.Email,
				Name:  dbGroupUser.Name,
			})
		}
		groups = append(groups, &model.Group{
			ID:    utility.ParseUintToString(dbGroup.ID),
			Name:  dbGroup.Name,
			Users: users,
		})
	}

	return groups, nil
}