package repository

import (
	"github.com/sijysn/resistar/backend/entity"
)

type GetUserLoginLogInput struct {
	Token string
	UserID uint
}

func (r *Repository) GetUserLoginLog(input GetUserLoginLogInput) (*entity.UserLoginLog, error) {
	var userLoginLog *entity.UserLoginLog
	err := r.DB.Where("token = ? AND user_id = ?", input.Token, input.UserID).Order("created_at DESC").Limit(1).Find(&userLoginLog).Error
	if err != nil {
		return nil, err
	}
	return userLoginLog, nil
}

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