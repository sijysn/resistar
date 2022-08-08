package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/sijysn/resistar/backend/graph/generated"
	"github.com/sijysn/resistar/backend/graph/model"
	dbModel "github.com/sijysn/resistar/backend/internal/model"
)

// FromUsers is the resolver for the fromUsers field.
func (r *historyResolver) FromUsers(ctx context.Context, obj *model.History) ([]*model.User, error) {
	var users []*model.User
	var user *model.User
	for _, v := range obj.FromUsers {
		r.DB.First(&model.User{ID: v.ID}).Scan(&user)
		users = append(users, &model.User{
			ID: user.ID,
			Name: user.Name,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
			DeletedAt: user.DeletedAt,
		})
	}
	return users, nil
}

// ToUsers is the resolver for the toUsers field.
func (r *historyResolver) ToUsers(ctx context.Context, obj *model.History) ([]*model.User, error) {
	var users []*model.User
	var user *model.User
	for _, v := range obj.FromUsers {
		r.DB.First(&model.User{ID: v.ID}).Scan(&user)
		users = append(users, &model.User{
			ID: user.ID,
			Name: user.Name,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
			DeletedAt: user.DeletedAt,
		})
	}
	return users, nil
}

// AddHistory is the resolver for the addHistory field.
func (r *mutationResolver) AddHistory(ctx context.Context, input model.NewHistory) (*model.History, error) {
	panic(fmt.Errorf("not implemented"))
}

// AddUser is the resolver for the addUser field.
func (r *mutationResolver) AddUser(ctx context.Context, input model.NewUser) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

// Histories is the resolver for the histories field.
func (r *queryResolver) Histories(ctx context.Context) ([]*model.History, error) {
	var histories []*model.History
	r.DB.Find(&dbModel.History{}).Scan(&histories)
	return histories, nil
}

// History returns generated.HistoryResolver implementation.
func (r *Resolver) History() generated.HistoryResolver { return &historyResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type historyResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
