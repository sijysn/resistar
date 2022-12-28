package repository

import "github.com/sijysn/resistar/backend/entity"

type GetInvitedUsersByUserIDInput struct {
	UserID uint
}

func (r *Repository) GetInvitedUsersByUserID(input GetInvitedUsersByUserIDInput) ([]entity.InvitedUser, error) {
	var invitedUsers []entity.InvitedUser
	err := r.DB.Debug().Where("user_id = ?", input.UserID).Find(&invitedUsers).Error
	if err != nil {
		return nil, err
	}
	return invitedUsers, nil
}

type GetInvitedUsersByGroupIDAndUserIDInput struct {
	GroupID uint
	UserID uint
}

func (r *Repository) GetInvitedUsersByGroupIDAndUserID(input GetInvitedUsersByGroupIDAndUserIDInput) ([]entity.InvitedUser, error) {
	var invitedUsers []entity.InvitedUser
	err := r.DB.Debug().Where("group_id = ? AND user_id = ?", input.GroupID, input.UserID).Order("created_at DESC").Limit(1).Find(&invitedUsers).Error
	if err != nil {
		return nil, err
	}
	return invitedUsers, nil
}

type SaveInvitedUserInput struct {
	InvitedUser entity.InvitedUser
}

func (r *Repository) SaveInvitedUser(input SaveInvitedUserInput) error {
	err := r.DB.Save(input.InvitedUser).Error
	if err != nil {
		return err
	}
	return nil
}