package usecase

import (
	"context"

	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/repository"
)

type Usecases interface {
	GetUsers(ctx context.Context, input model.UsersQuery) ([]*model.User, error)
	GetGroups(ctx context.Context, input model.GroupsQuery) ([]*model.Group, error) 
	LoginUser(ctx context.Context, input model.LoginUser) (*model.Result, error)
}

type UsecaseRepository struct {
	Repository repository.Queries
}

func NewUsecase(repository repository.Queries) Usecases {
	return &UsecaseRepository{
		Repository: repository,
	}
}