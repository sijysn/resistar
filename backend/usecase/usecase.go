package usecase

import (
	"context"

	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/repository"
)

type Usecases interface {
	GetUsers(ctx context.Context, input model.UsersQuery) ([]*model.User, error)
	GetGroups(ctx context.Context, input model.GroupsQuery) ([]*model.Group, error)
	GetGroupsWhereUserHasBeenInvited(ctx context.Context, input model.GroupsQuery) ([]*model.Group, error)
	AddGroup(ctx context.Context, input model.NewGroup) (*model.Result, error)
	GetHistories(ctx context.Context, input model.HistoriesQuery) ([]*model.History, error)
	GetAmounts(ctx context.Context, input model.AmountsQuery) (*model.Amounts, error)
	GetAdjustments(ctx context.Context, input model.AdjustmentQuery) ([]*model.Adjustment, error)
	JoinGroup(ctx context.Context, input model.JoinGroup) (*model.Result, error)
	LoginUser(ctx context.Context, input model.LoginUser) (*model.Result, error)
	LoginGroup(ctx context.Context, input model.LoginGroup) (*model.Result, error)
	LogoutGroup(ctx context.Context) (*model.Result, error)
	InviteUserToGroup(ctx context.Context, input model.InviteUserToGroupInput) (*model.Result, error)
}

type UsecaseRepository struct {
	Repository repository.Queries
}

func NewUsecase(repository repository.Queries) Usecases {
	return &UsecaseRepository{
		Repository: repository,
	}
}