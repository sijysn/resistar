package repository

import (
	"github.com/sijysn/resistar/backend/entity"
	"github.com/sijysn/resistar/backend/utility"
)

type GetUsersInput struct {
	GroupID uint
}

type GetUserWithGroupsByIDInput struct {
	UserID uint
}

type GetUserByEmailAndPasswordInput struct {
	Email string
	Password string
}

func(r *Repository) GetUsers(input GetUsersInput) ([]entity.User, error) {
	var dbGroup *entity.Group
	err := r.DB.Debug().Where("id = ?", input.GroupID).Preload("Users").Limit(1).Find(&dbGroup).Error
	if err != nil {
		return nil, err
	}
	return dbGroup.Users, nil
}

func(r *Repository) GetUserWithGroupsByID(input GetUserWithGroupsByIDInput) (*entity.User, error) {
	var user *entity.User
	err := r.DB.Debug().Where("id = ?", input.UserID).Preload("Groups").Limit(1).Find(&user).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}

func(r *Repository) GetUserByEmailAndPassword(input GetUserByEmailAndPasswordInput) ([]entity.User, error) {
	var dbUsers []entity.User
	err := r.DB.Debug().Where("email = ? AND password = ?", input.Email, utility.SHA512(input.Password)).Limit(1).Find(&dbUsers).Error
	if err != nil {
		return nil, err
	}
	return dbUsers, nil
}