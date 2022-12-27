package repository

import (
	"github.com/sijysn/resistar/backend/entity"
)

type Queries interface {
	GetUsers(input GetUsersInput) ([]entity.User, error)
	GetUserByEmailAndPassword(input GetUserByEmailAndPasswordInput) ([]entity.User, error)
	CreateUserLoginLog(input CreateUserLoginLogInput) error
}