package repository

import "github.com/sijysn/resistar/backend/entity"

type GetInvitedUsersInput struct {
	UserID uint
}

func (r *Repository) GetInvitedUsersByUserID(input GetInvitedUsersInput) ([]entity.InvitedUser, error) {
	var invitedUsers []entity.InvitedUser
	err := r.DB.Debug().Where("user_id = ?", input.UserID).Find(&invitedUsers).Error
	if err != nil {
		return nil, err
	}
	return invitedUsers, nil
}