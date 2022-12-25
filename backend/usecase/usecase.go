package usecase

import (
	"context"

	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/repository"
)

type Usecases interface {
	GetUsers(ctx context.Context, input model.UsersQuery) ([]*model.User, error)
}

type UsecaseRepository struct {
	Repository repository.Queries
}

func NewUsecase(repository repository.Queries) Usecases {
	return &UsecaseRepository{
		Repository: repository,
	}
}