package repository

import "github.com/sijysn/resistar/backend/entity"

type CreateUserLoginLogInput struct {
	UserID uint
	Token string 
}

func(r *Repository) CreateUserLoginLog(input CreateUserLoginLogInput) error {
	loginLog := &entity.UserLoginLog{
		UserID: input.UserID,
		Token:  input.Token,
	}
	err := r.DB.Debug().Create(loginLog).Error
	if err != nil {
		return err
	}
	return nil
}