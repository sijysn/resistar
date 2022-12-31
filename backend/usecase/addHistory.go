package usecase

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/sijysn/resistar/backend/entity"
	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/middleware"
	"github.com/sijysn/resistar/backend/repository"
	"github.com/sijysn/resistar/backend/utility"
)

func (u *UsecaseRepository) AddHistory(ctx context.Context, input model.NewHistory) (*model.History, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	if responseAccess.Status != auth.StatusGroup {
		errorMessage := "認証されていません"
		return &model.History{
			ErrorMessage: &errorMessage,
		}, nil
	}

	dbFromUsers, err := getUsersByInputIDs(u, input.FromUserIds)
	if err != nil {
		return nil, err
	}

	dbToUsers, err := getUsersByInputIDs(u, input.ToUserIds)
	if err != nil {
		return nil, err
	}

	groupID, err := utility.ParseStringToUint(input.GroupID)
	if err != nil {
		return nil, err
	}

	createHistoryInput := repository.CreateHistoryInput{
		Title:   input.Title,
		Type:    model.Type(input.Type),
		Price:   input.Price,
		GroupID: groupID,
	}
	dbNewHistory, err := u.Repository.CreateHistory(createHistoryInput)
	if err != nil {
		return nil, err
	}

	err = addAssociations(u, dbNewHistory, dbFromUsers, dbToUsers)
	if err != nil {
		return nil, err
	}

	err = addBalances(u, input.Price, dbFromUsers, dbToUsers, dbNewHistory.CreatedAt, dbNewHistory.UpdatedAt, dbNewHistory.ID, groupID)
	if err != nil {
		return nil, err
	}

	newHistory := &model.History{
		ID:        utility.ParseUintToString(dbNewHistory.ID),
		Title:     dbNewHistory.Title,
		Type:      dbNewHistory.Type,
		Price:     dbNewHistory.Price,
		CreatedAt: dbNewHistory.CreatedAt.Format("2006-01-02 15:04:05"),
	}

	return newHistory, nil
}

func getUsersByInputIDs(u *UsecaseRepository, ids []string) ([]entity.User, error) {
	var userIds []uint
	for _, userID := range ids {
		parsedID, err := utility.ParseStringToUint(userID)
		if err != nil {
			return nil, err
		}
		userIds = append(userIds, parsedID)
	}
	getUsersInput := repository.GetUsersInput{
		UserIDs: userIds,
	}
	dbUsers, err := u.Repository.GetUsers(getUsersInput)
	if err != nil {
		return nil, err
	}
	return dbUsers, nil
}

func addAssociations(u *UsecaseRepository, newHistory *entity.History, fromUsers []entity.User, toUsers []entity.User) error {
	addFromUsersAssociationInput := repository.AddFromUsersAssociationInput{
		History: newHistory,
		Users: fromUsers,
	}
	err := u.Repository.AddFromUsersAssociation(addFromUsersAssociationInput)
	if err != nil {
		return err
	}

	addToUsersAssociationInput := repository.AddToUsersAssociationInput{
		History: newHistory,
		Users: toUsers,
	}
	err = u.Repository.AddToUsersAssociation(addToUsersAssociationInput)
	if err != nil {
		return err
	}
	return nil
}

func addBalances(u *UsecaseRepository, price int, fromUsers []entity.User, toUsers []entity.User, createdAt time.Time, updatedAt time.Time, historyID uint, groupID uint) error {
	fromUsersLength := len(fromUsers)
	var balances []entity.Balance
	for _, v := range fromUsers {
		balance := entity.Balance{
			CreatedAt: createdAt,
			UpdatedAt: updatedAt,
			Amount:   price / fromUsersLength,
			HistoryID: historyID,
			UserID:    v.ID,
			GroupID:   groupID,
		}
		balances = append(balances, balance)
	}
	toUsersLength := len(toUsers)
	for _, v := range toUsers {
		balance := entity.Balance{
			CreatedAt: createdAt,
			UpdatedAt: updatedAt,
			Amount:   -(price / toUsersLength),
			HistoryID: historyID,
			UserID:    v.ID,
			GroupID:   groupID,
		}
		balances = append(balances, balance)
	}
	
	createBalancesInput := repository.CreateBalancesInput{
		Balances: balances,
	}
	_, err := u.Repository.CreateBalances(createBalancesInput)
	if err != nil {
		return err
	}
	return nil
}