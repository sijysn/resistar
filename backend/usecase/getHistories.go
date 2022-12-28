package usecase

import (
	"context"
	"fmt"
	"net/http"

	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/middleware"
	"github.com/sijysn/resistar/backend/repository"
	"github.com/sijysn/resistar/backend/utility"
)

func (u *UsecaseRepository) GetHistories(ctx context.Context, input model.HistoriesQuery) ([]*model.History, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	var histories []*model.History
	if responseAccess.Status != auth.StatusGroup {
		errorMessage := "認証されていません"
		histories = append(histories, &model.History{
			ErrorMessage: &errorMessage,
		})
		return histories, nil
	}
	groupID, err := utility.ParseStringToUint(input.GroupID)
	if err != nil {
		return nil, err
	}
	getHistoriesByGroupIDInput := repository.GetHistoriesByGroupIDInput{
		Year: input.Year,
		Month: input.Month,
		GroupID: groupID,
	}
	dbHistories, err := u.Repository.GetHistoriesByGroupID(getHistoriesByGroupIDInput)

	if err != nil {
		return nil, err
	}
	for _, v := range dbHistories {
		var fromUsers, toUsers []*model.User
		for _, fromUser := range v.FromUsers {
			fromUsers = append(fromUsers, &model.User{
				ID:       utility.ParseUintToString(fromUser.ID),
				Email:    fromUser.Email,
				Name:     fromUser.Name,
				ImageURL: fromUser.ImageURL,
			})
		}
		for _, toUser := range v.ToUsers {
			toUsers = append(toUsers, &model.User{
				ID:       utility.ParseUintToString(toUser.ID),
				Email:    toUser.Email,
				Name:     toUser.Name,
				ImageURL: toUser.ImageURL,
			})
		}

		history := &model.History{
			ID:        utility.ParseUintToString(v.ID),
			Title:     v.Title,
			Type:      v.Type,
			Price:     v.Price,
			FromUsers: fromUsers,
			ToUsers:   toUsers,
			CreatedAt: v.CreatedAt.Format("2006-01-02 15:04:05"),
			GroupID:   utility.ParseUintToString(v.GroupID),
		}
		histories = append(histories, history)
	}

	return histories, nil
}