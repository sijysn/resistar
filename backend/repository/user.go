package repository

import (
	"github.com/sijysn/resistar/backend/entity"
	"github.com/sijysn/resistar/backend/internal/digest"
)

type GetUsersInput struct {
	GroupID uint
}

type GetUserByEmailAndPasswordInput struct {
	Email string
	Password string
}

func(repository *Repository) GetUsers(input GetUsersInput)([]entity.User, error) {
	var dbGroup *entity.Group
	err := repository.DB.Debug().Where("id = ?", input.GroupID).Preload("Users").Limit(1).Find(&dbGroup).Error
	if err != nil {
		return nil, err
	}
	return dbGroup.Users, nil
}

func(repository *Repository) GetUserByEmailAndPassword(input GetUserByEmailAndPasswordInput) ([]entity.User, error) {
	var dbUsers []entity.User
	err := repository.DB.Debug().Where("email = ? AND password = ?", input.Email, digest.SHA512(input.Password)).Limit(1).Find(&dbUsers).Error
	if err != nil {
		return nil, err
	}
	return dbUsers, nil
}