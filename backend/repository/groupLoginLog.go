package repository

import "github.com/sijysn/resistar/backend/entity"

type CreateGroupLoginLogInput struct {
	UserID uint
	GroupID uint
	Token string 
}

func(r *Repository) CreateGroupLoginLog(input CreateGroupLoginLogInput) error {
	loginLog := &entity.GroupLoginLog{
		UserID: input.UserID,
		GroupID: input.GroupID,
		Token:  input.Token,
	}
	err := r.DB.Debug().Create(loginLog).Error
	if err != nil {
		return err
	}
	return nil
}