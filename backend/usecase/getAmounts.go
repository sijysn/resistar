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

func (u *UsecaseRepository) GetAmounts(ctx context.Context, input model.AmountsQuery) (*model.Amounts, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	if responseAccess.Status != auth.StatusGroup {
		errorMessage := "認証されていません"
		return &model.Amounts{
			ErrorMessage: &errorMessage,
		}, nil
	}

	var amounts *model.Amounts

	groupID, err := utility.ParseStringToUint(input.GroupID)
	if err != nil {
		return nil, err
	}
	userID, err := utility.ParseStringToUint(input.UserID)
	if err != nil {
		return nil, err
	}

	scanPersonalBalanceInput := repository.ScanPersonalBalanceInput{
		Year: input.Year,
		Month: input.Month,
		UserID: userID,
		GroupID: groupID,
		Amounts: amounts,
	}
	amounts, err = u.Repository.ScanPersonalBalance(scanPersonalBalanceInput)
	if err != nil {
		return nil, err
	}

	scanGroupTotalInput := repository.ScanGroupTotalInput{
		Year: input.Year,
		Month: input.Month,
		GroupID: groupID,
		Amounts: amounts,
	}
	amounts, err = u.Repository.ScanGroupTotal(scanGroupTotalInput)
	if err != nil {
		return nil, err
	}

	return amounts, nil
}