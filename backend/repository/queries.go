package repository

import (
	"github.com/sijysn/resistar/backend/entity"
	"github.com/sijysn/resistar/backend/graph/model"
)

type Queries interface {
	GetUsers(input model.UsersQuery) ([]*model.User, error)
	GetUserByEmailAndPassword(input model.LoginUser) ([]*entity.User, error)
	CreateUserLoginLog(input CreateUserLoginLogInput) error
}