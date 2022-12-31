package repository

import (
	"github.com/sijysn/resistar/backend/entity"
	"github.com/sijysn/resistar/backend/utility"
)

type GetUsersInput struct {
	UserIDs []uint
}

type GetUserInput struct {
	UserID uint
}

type GetUserWithGroupsByIDInput struct {
	UserID uint
}

type GetUserByEmailInput struct {
	Email string
}

type GetUserByEmailAndPasswordInput struct {
	Email string
	Password string
}

func(r *Repository) GetUsers(input GetUsersInput) ([]entity.User, error) {
	var users []entity.User
	err := r.DB.Where(input.UserIDs).Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}

func(r *Repository) GetUser(input GetUserInput) (*entity.User, error) {
	var user *entity.User
	err := r.DB.Debug().Where("id = ?", input.UserID).Limit(1).First(&user).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}

func(r *Repository) GetUserWithGroupsByID(input GetUserWithGroupsByIDInput) (*entity.User, error) {
	var user *entity.User
	err := r.DB.Debug().Where("id = ?", input.UserID).Preload("Groups").Limit(1).Find(&user).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}

func(r *Repository) GetUserByEmail(input GetUserByEmailInput) (*entity.User, error) {
	var user *entity.User
	err := r.DB.Where("email = ?", input.Email).Limit(1).First(&user).Error
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

type CreateUserInput struct {
	Email string
	Password string
}

func(r *Repository) CreateUser(input CreateUserInput) (*entity.User, error) {
	newUser := &entity.User{
		Email:    input.Email,
		Password: input.Password,
	}
	err := r.DB.Create(newUser).Error
	if err != nil {
		return nil, err
	}
	return newUser, nil
}