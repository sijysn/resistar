package repository

import (
	"github.com/sijysn/resistar/backend/entity"
)

type Queries interface {
	GetUsers(input GetUsersInput) ([]entity.User, error)
	GetUserByID(input GetUserByIDInput) (*entity.User, error)
	GetUserByEmailAndPassword(input GetUserByEmailAndPasswordInput) ([]entity.User, error)
	GetGroupByID(input GetGroupByIDInput) (*entity.Group, error)
	GetHistoriesByGroupID(input GetHistoriesByGroupIDInput) ([]entity.History, error)
	CreateUserLoginLog(input CreateUserLoginLogInput) error
}