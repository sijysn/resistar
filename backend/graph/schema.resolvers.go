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

// FromUsers is the resolver for the fromUsers field.
func (r *historyResolver) FromUsers(ctx context.Context, obj *model.History) ([]*model.User, error) {
	// var histories []*model.History
	var dbHistories []dbModel.History
	// var historyForScan []dbModel.HistoryForScan
	// var dbFromUsers []dbModel.User
	var fromUsers []*model.User
	// var toUsers []*model.User

	err := r.DB.Debug().Model(&dbHistories).Preload("FromUsers").Find(&dbHistories).Error
	if err != nil {
		return nil, err
	}
	for _, v := range dbHistories {
		// fmt.Println(len(v.ToUsers))
		for _, valueFromUser := range v.FromUsers {
			fromUser := &model.User{
				ID: strconv.FormatUint(uint64(valueFromUser.ID),10),
				Name: valueFromUser.Name,
			}
			fromUsers = append(fromUsers, fromUser)
		}
	}

	return fromUsers, nil
}

// ToUsers is the resolver for the toUsers field.
func (r *historyResolver) ToUsers(ctx context.Context, obj *model.History) ([]*model.User, error) {
	var dbHistories []dbModel.History
	var toUsers []*model.User

	err := r.DB.Debug().Model(&dbHistories).Preload("ToUsers").Find(&dbHistories).Error
	if err != nil {
		return nil, err
	}
	for _, v := range dbHistories {
		for _, valueToUser := range v.ToUsers {
			toUser := &model.User{
				ID: strconv.FormatUint(uint64(valueToUser.ID),10),
				Name: valueToUser.Name,
			}
			toUsers = append(toUsers, toUser)
		}
	}

	return toUsers, nil
}

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
		Title:     input.Title,
		Type:      model.Type(input.Type),
		Price:     input.Price,
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
		ID: strconv.FormatUint(uint64(historyForScan.ID),10),
		Title: historyForScan.Title,
		Type: historyForScan.Type,
		Price: historyForScan.Price,
		FromUsers: fromUsers,
		ToUsers: toUsers,
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
func (r *queryResolver) Histories(ctx context.Context) ([]*model.History, error) {
	var histories []*model.History
	var historyForScan []dbModel.HistoryForScan

	err := r.DB.Debug().Model(&dbModel.History{}).Find(&historyForScan).Error
	if err != nil {
		return nil, err
	}
	for _, v := range historyForScan {
		history := &model.History{
			ID: strconv.FormatUint(uint64(v.ID),10),
			Title: v.Title,
			Type: v.Type,
			Price: v.Price,
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

// History returns generated.HistoryResolver implementation.
func (r *Resolver) History() generated.HistoryResolver { return &historyResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type historyResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
