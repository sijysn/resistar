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

func (u *UsecaseRepository) DeleteHistory(ctx context.Context, input model.DeleteHistory) (*model.Result, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	if responseAccess.Status != auth.StatusGroup {
		errorMessage := "認証されていません"
		return &model.Result{
			Message: errorMessage,
		}, nil
	}
	id, err := utility.ParseStringToUint(input.ID)
	if err != nil {
		return nil, err
	}
	deleteHistoryInput := repository.DeleteHistoryInput{
		HistoryID: id,
	}
	err = u.Repository.DeleteHistory(deleteHistoryInput)
	if err != nil {
		return nil, err
	}

	message := "履歴を削除しました"
	return &model.Result{
		Message: message,
		Success: true,
	}, nil
}