package usecase

import (
	"context"
	"fmt"
	"net/http"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-ozzo/ozzo-validation/is"
	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/middleware"
	"github.com/sijysn/resistar/backend/repository"
	"github.com/sijysn/resistar/backend/utility"
)

func (u *UsecaseRepository) InviteUserToGroup(ctx context.Context, input model.InviteUserToGroupInput) (*model.Result, error) {
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
	getUserByEmailInput := repository.GetUserByEmailInput{
		Email: input.Email,
	}
	dbUser, err := u.Repository.GetUserByEmail(getUserByEmailInput)
	if err != nil {
		errorMessage := "このメールアドレスは登録されていません"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	groupID, err := utility.ParseStringToUint(input.GroupID)
	if err != nil {
		return nil, err
	}

	// グループが存在するかチェックする
	getGroupByIDInput :=repository.GetGroupByIDInput{
		GroupID: groupID,
	}
	dbGroup, err := u.Repository.GetGroupByID(getGroupByIDInput)
	if err != nil {
		errorMessage := "無効なグループです"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	userID := dbUser.ID
	// ユーザーがグループに参加しているかチェックする
	getGroupWithUsersByIDAndUserIDInput := repository.GetGroupWithUsersByIDAndUserIDInput{
		GroupID: groupID,
		UserID: userID,
	}
	dbGroup, err = u.Repository.GetGroupWithUsersByIDAndUserID(getGroupWithUsersByIDAndUserIDInput)
	if err != nil {
		return nil, err
	}
	if len(dbGroup.Users) == 1 {
		errorMessage := "このメールアドレスのユーザーは招待できません"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	getInvitedUsersByGroupIDAndUserID := repository.GetInvitedUsersByGroupIDAndUserIDInput{
		GroupID: groupID,
		UserID: userID,
	}

	dbInvitedUsers, err := u.Repository.GetInvitedUsersByGroupIDAndUserID(getInvitedUsersByGroupIDAndUserID)
	if err != nil {
		return nil, err
	}
	// まだ招待されてないか、退会済みの場合
	if len(dbInvitedUsers) == 0 || dbInvitedUsers[0].Joined {
		inviteUserInput := repository.InviteUserInput{
			GroupID: groupID,
			UserID:  userID,
			Joined:  false,
		}
		err = u.Repository.InviteUser(inviteUserInput)
		if err != nil {
			return nil, err
		}
		message := "招待メールを送りました"
		return &model.Result{
			Message: message,
			Success: true,
		}, nil
	}
	errorMessage := "このメールアドレスのユーザーは招待できません"
	return &model.Result{
		Message: errorMessage,
		Success: false,
	}, nil
}