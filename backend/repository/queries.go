package repository

import (
	"github.com/sijysn/resistar/backend/graph/model"
)

type Queries interface {
	GetUsers(input model.UsersQuery) ([]*model.User, error)
}