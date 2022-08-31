package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/sijysn/resistar/backend/graph/generated"
	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/digest"
	dbModel "github.com/sijysn/resistar/backend/internal/model"
	"github.com/sijysn/resistar/backend/internal/sql"
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

	groupID, err := strconv.ParseUint(input.GroupID, 10, 64)
	if err != nil {
		return nil, err
	}

	dbNewHistory := &dbModel.History{
		Title:   input.Title,
		Type:    model.Type(input.Type),
		Price:   input.Price,
		GroupID: uint(groupID),
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

	err = sql.AddBalances(r.DB, input.Price, dbFromUsers, dbToUsers, historyForScan.CreatedAt, historyForScan.UpdatedAt, dbNewHistory.ID, uint(groupID))
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
	var dbUsers []dbModel.User
	count := r.DB.Where("email = ?", input.Email).Find(&dbUsers).RowsAffected
	if count != 0 {
		errorMessage := "このメールアドレスは既に登録されています"
		return &model.User{
			ErrorMessage: &errorMessage,
		}, nil
	}

	password := digest.SHA512(input.Password)
	dbNewUser := &dbModel.User {
		Email:    input.Email,
		Password: password,
	}
	err := r.DB.Create(dbNewUser).Error
	if err != nil {
		return nil, err
	}

	newUser := &model.User{
		ID:       strconv.FormatUint(uint64(dbNewUser.ID), 10),
		Email:    dbNewUser.Email,
		Password: password,
	}
	return newUser, nil
}

// AddGroup is the resolver for the addGroup field.
func (r *mutationResolver) AddGroup(ctx context.Context, input model.InitGroup) (*model.Group, error) {
	var dbUsers []dbModel.User

	err := r.DB.Debug().Preload("Groups").Where("id = ?", input.UserID).Find(&dbUsers).Error
	if err != nil {
		return nil, err
	}
	dbNewGroup := &dbModel.Group{
		Name: input.GroupName,
	}
	err = r.DB.Create(dbNewGroup).Error
	if err != nil {
		return nil, err
	}
	err = r.DB.Model(dbNewGroup).Association("Users").Append(dbUsers)
	if err != nil {
		return nil, err
	}
	newGroup := &model.Group{
		ID:        strconv.FormatUint(uint64(dbNewGroup.ID), 10),
		Name:      dbNewGroup.Name,
		CreatedAt: dbNewGroup.CreatedAt.Format("2006-01-02 15:04:05"),
	}
	return newGroup, nil
}

// Login is the resolver for the login field.
func (r *mutationResolver) Login(ctx context.Context, input model.LoginUser) (*model.User, error) {
	sessionToken := digest.GenerateToken()
	r.Session.Put(ctx, "session_token", sessionToken)

	signKey := digest.GenerateSignKey()
	claims := jwt.MapClaims{
		"session_token": sessionToken,
		"groupID":       input.GroupID,
		"exp":           time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtToken, err := token.SignedString(signKey)
	if err != nil {
		return nil, err
	}

	responseAccess := ctx.Value(auth.ResponseAccessKey).(*auth.ResponseAccess)
	responseAccess.SetCookie("jwt-token", jwtToken, false, time.Now().Add(24*time.Hour))

	var dbUser dbModel.User
	err = r.DB.Where("email = ? AND password = ?", input.Email, digest.SHA512(input.Password)).Find(&dbUser).Error
	if err != nil {
		return nil, err
	}
	user := &model.User {
		ID: strconv.FormatUint(uint64(dbUser.ID), 10),
		Email: dbUser.Email,
		Name: dbUser.Name,
		ImageURL: dbUser.ImageURL,
	}
	return user, nil
}

// Histories is the resolver for the histories field.
func (r *queryResolver) Histories(ctx context.Context, input model.HistoriesQuery) ([]*model.History, error) {
	var histories []*model.History
	var dbHistories []dbModel.History
	groupID, err := strconv.ParseUint(input.GroupID, 10, 64)
	if err != nil {
		return nil, err
	}
	err = r.DB.Debug().Preload("FromUsers").Preload("ToUsers").Where("group_id = ? AND date_part('year', created_at) = ? AND date_part('month', created_at) = ?", groupID, input.Year, input.Month).Order("created_at DESC").Find(&dbHistories).Error
	if err != nil {
		return nil, err
	}
	for _, v := range dbHistories {
		var fromUsers, toUsers []*model.User
		for _, fromUser := range v.FromUsers {
			fromUsers = append(fromUsers, &model.User{
				ID:       strconv.FormatUint(uint64(fromUser.ID), 10),
				Name:     fromUser.Name,
				ImageURL: fromUser.ImageURL,
			})
		}
		for _, toUser := range v.ToUsers {
			toUsers = append(toUsers, &model.User{
				ID:       strconv.FormatUint(uint64(toUser.ID), 10),
				Name:     toUser.Name,
				ImageURL: toUser.ImageURL,
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
			GroupID:   strconv.FormatUint(uint64(v.GroupID), 10),
		}
		histories = append(histories, history)
	}

	return histories, nil
}

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context, input model.UsersQuery) ([]*model.User, error) {
	var users []*model.User
	var dbGroup *dbModel.Group
	groupID, err := strconv.ParseUint(input.GroupID, 10, 64)
	if err != nil {
		return nil, err
	}
	err = r.DB.Debug().Where("id = ?", uint(groupID)).Preload("Users").First(&dbGroup).Error
	if err != nil {
		return nil, err
	}
	for _, dbUser := range dbGroup.Users {
		users = append(users, &model.User{
			ID:       strconv.FormatUint(uint64(dbUser.ID), 10),
			Email:    dbUser.Email,
			Name:     dbUser.Name,
			ImageURL: dbUser.ImageURL,
		})
	}
	return users, nil
}

// Groups is the resolver for the groups field.
func (r *queryResolver) Groups(ctx context.Context, input model.GroupsQuery) ([]*model.Group, error) {
	var groups []*model.Group
	var dbUser *dbModel.User
	userID, err := strconv.ParseUint(input.UserID, 10, 64)
	if err != nil {
		return nil, err
	}
	err = r.DB.Debug().Where("id = ?", uint(userID)).Preload("Groups").First(&dbUser).Error
	if err != nil {
		return nil, err
	}

	for _, dbGroup := range dbUser.Groups {
		// 所属しているグループのメンバーを取得する
		var myGroupUsers []*model.User
		var dbMyGroup *dbModel.Group
		err = r.DB.Debug().Where("id = ?", uint(dbGroup.ID)).Preload("Users").First(&dbMyGroup).Error
		fmt.Println(dbMyGroup)
		if err != nil {
			return nil, err
		}
		for _, dbMyGroupUser := range dbMyGroup.Users {
			myGroupUsers = append(myGroupUsers, &model.User{
				ID:       strconv.FormatUint(uint64(dbMyGroupUser.ID), 10),
				Email: dbMyGroupUser.Email,
				Name: dbMyGroupUser.Name,
			})
		}

		groups = append(groups, &model.Group{
			ID:       strconv.FormatUint(uint64(dbGroup.ID), 10),
			Name:     dbGroup.Name,
			Users:    myGroupUsers,
		})
	}
	return groups, nil
}

// Amounts is the resolver for the amounts field.
func (r *queryResolver) Amounts(ctx context.Context, input model.AmountsQuery) (*model.Amounts, error) {
	var amounts *model.Amounts

	groupID, err := strconv.ParseUint(input.GroupID, 10, 64)
	if err != nil {
		return nil, err
	}
	userID, err := strconv.ParseUint(input.UserID, 10, 64)
	if err != nil {
		return nil, err
	}

	err = r.DB.Debug().Table("balances").Select("SUM(amount) as personal_balance").Where("group_id = ? AND user_id = ? AND date_part('year', created_at) = ? AND date_part('month', created_at) = ?", groupID, userID, input.Year, input.Month).Scan(&amounts).Error
	if err != nil {
		return nil, err
	}

	err = r.DB.Debug().Table("balances").Select("SUM(amount) as group_total").Where("group_id = ? AND date_part('year', created_at) = ? AND date_part('month', created_at) = ? AND amount > 0", groupID, input.Year, input.Month).Scan(&amounts).Error
	if err != nil {
		return nil, err
	}

	return amounts, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
