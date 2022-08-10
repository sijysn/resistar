package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"strconv"

	"github.com/sijysn/resistar/backend/graph/generated"
	"github.com/sijysn/resistar/backend/graph/model"
	dbModel "github.com/sijysn/resistar/backend/internal/model"
)

// AddHistory is the resolver for the addHistory field.
func (r *mutationResolver) AddHistory(ctx context.Context, input model.NewHistory) (*model.History, error) {
	var dbFromUsers []dbModel.User
	var fromUsers []*model.User
	err := r.DB.Where(input.FromUserIds).Find(&dbFromUsers).Scan(&fromUsers).Error
	if err != nil {
		return nil, err
	}

	var dbToUsers []dbModel.User
	var toUsers []*model.User
	err = r.DB.Where(input.ToUserIds).Find(&dbToUsers).Scan(&toUsers).Error
	if err != nil {
		return nil, err
	}

	dbNewHistory := &dbModel.History{
		Title: input.Title,
		Type:  model.Type(input.Type),
		Price: input.Price,
	}

	var newHistory *model.History
	var historyForScan *dbModel.HistoryForScan
	err = r.DB.Create(dbNewHistory).Scan(&historyForScan).Error
	if err != nil {
		return nil, err
	}
	err = r.DB.Model(dbNewHistory).Association("FromUsers").Append(dbFromUsers)
	if err != nil {
		return nil, err
	}
	err = r.DB.Model(dbNewHistory).Association("ToUsers").Append(dbToUsers)
	if err != nil {
		return nil, err
	}
	newHistory = &model.History{
		ID:        strconv.FormatUint(uint64(historyForScan.ID), 10),
		Title:     historyForScan.Title,
		Type:      historyForScan.Type,
		Price:     historyForScan.Price,
		FromUsers: fromUsers,
		ToUsers:   toUsers,
		CreatedAt: historyForScan.CreatedAt.Format("2006-01-02 15:04:05"),
	}
	return newHistory, nil
}

// AddUser is the resolver for the addUser field.
func (r *mutationResolver) AddUser(ctx context.Context, input model.NewUser) (*model.User, error) {
	var newUser *model.User
	r.DB.Create(&dbModel.User{Name: input.Name}).Scan(&newUser)
	return newUser, nil
}

// Histories is the resolver for the histories field.
func (r *queryResolver) Histories(ctx context.Context, input model.HistoriesQuery) ([]*model.History, error) {
	var histories []*model.History
	var dbHistories []dbModel.History

	err := r.DB.Debug().Preload("FromUsers").Preload("ToUsers").Where("date_part('year', created_at) = ? AND date_part('month', created_at) = ?", input.Year, input.Month).Order("created_at DESC").Find(&dbHistories).Error
	if err != nil {
		return nil, err
	}
	for _, v := range dbHistories {
		var fromUsers, toUsers []*model.User
		for _, fromUser := range v.FromUsers {
			fromUsers = append(fromUsers, &model.User{
				ID:   strconv.FormatUint(uint64(fromUser.ID), 10),
				Name: fromUser.Name,
			})
		}
		for _, toUser := range v.ToUsers {
			toUsers = append(toUsers, &model.User{
				ID:   strconv.FormatUint(uint64(toUser.ID), 10),
				Name: toUser.Name,
			})
		}

		history := &model.History{
			ID:        strconv.FormatUint(uint64(v.ID), 10),
			Title:     v.Title,
			Type:      v.Type,
			Price:     v.Price,
			FromUsers: fromUsers,
			ToUsers:   toUsers,
			CreatedAt: v.CreatedAt.Format("2006-01-02 15:04:05"),
		}
		histories = append(histories, history)
	}

	return histories, nil
}

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	var users []*model.User
	r.DB.Find(&dbModel.User{}).Scan(&users)
	return users, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }