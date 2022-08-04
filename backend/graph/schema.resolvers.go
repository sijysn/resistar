package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	ulid "github.com/oklog/ulid/v2"
	"github.com/sijysn/resistar/backend/graph/generated"
	"github.com/sijysn/resistar/backend/graph/model"
)

// AddHistory is the resolver for the addHistory field.
func (r *mutationResolver) AddHistory(ctx context.Context, input model.NewHistory) (*model.History, error) {
	newHistory := &model.History{
		ID: ulid.Make().String(),
		Title: input.Title,
		Type: input.Type,
		Price: input.Price,
		FromUsers: r.users,
		ToUsers: r.users,
	}
	r.histories = append(r.histories, newHistory)
	return newHistory, nil
}

// Histories is the resolver for the histories field.
func (r *queryResolver) Histories(ctx context.Context) ([]*model.History, error) {
	return r.histories, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
