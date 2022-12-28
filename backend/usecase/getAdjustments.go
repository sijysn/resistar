package usecase

import (
	"context"
	"fmt"
	"math"
	"net/http"
	"sort"

	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/middleware"
	"github.com/sijysn/resistar/backend/repository"
	"github.com/sijysn/resistar/backend/utility"
)

func (u *UsecaseRepository) GetAdjustments(ctx context.Context, input model.AdjustmentQuery) ([]*model.Adjustment, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	var adjustments []*model.Adjustment
	if responseAccess.Status != auth.StatusGroup {
		errorMessage := "認証されていません"
		adjustments = append(adjustments, &model.Adjustment{
			ErrorMessage: &errorMessage,
		})
		return adjustments, nil
	}

	groupID, err := utility.ParseStringToUint(input.GroupID)
	if err != nil {
		return nil, err
	}

	var personalBalancesWithUserInfo []*repository.PersonalBalanceWithUserInfo
	scanPersonalBalancesWithUserInfoInput := repository.ScanPersonalBalancesWithUserInfoInput{
		Year: input.Year,
		Month: input.Month,
		GroupID: groupID,
		PersonalBalancesWithUserInfo: personalBalancesWithUserInfo,
	}
	personalBalancesWithUserInfo, err = u.Repository.ScanPersonalBalancesWithUserInfo(scanPersonalBalancesWithUserInfoInput)
	if err != nil {
		return nil, err
	}

	var userPersonalBalances []*userPersonalBalance
	for _, v := range personalBalancesWithUserInfo {
		userPersonalBalances = append(userPersonalBalances, &userPersonalBalance{
			PersonalBalance: v.PersonalBalance,
			User: &model.User{
				ID:    utility.ParseUintToString(v.ID),
				Email: v.Email,
				Name:  v.Name,
			},
		})
	}

	adjustments = calculateAdjustments(adjustments, userPersonalBalances, 10)
	return adjustments, nil
}

func calculateAdjustments(adjustments []*model.Adjustment, userPersonalBalances []*userPersonalBalance, numberToTruncate float64) []*model.Adjustment {
	paidTooMuch := &userPersonalBalance{}
	paidLess := &userPersonalBalance{}
	var i int
	for true {
		sort.Slice(userPersonalBalances, func(i, j int) bool { return userPersonalBalances[i].PersonalBalance < userPersonalBalances[j].PersonalBalance })
		for _, pb := range userPersonalBalances {
			if pb.PersonalBalance > paidTooMuch.PersonalBalance {
				paidTooMuch = pb
			}
			if pb.PersonalBalance < paidLess.PersonalBalance {
				paidLess = pb
			}
		}

		if paidTooMuch.PersonalBalance == paidLess.PersonalBalance {
			break
		}
		payment := math.Min(float64(paidTooMuch.PersonalBalance), math.Abs(float64(paidLess.PersonalBalance)))
		if payment < numberToTruncate {
			break
		}
		adjustments = append(adjustments, &model.Adjustment{
			FromUser: paidLess.User,
			ToUser:   paidTooMuch.User,
			Amount:   int(payment),
		})
		paidTooMuch.PersonalBalance -= int(payment)
		paidLess.PersonalBalance += int(payment)
		i++
	}

	return adjustments
}

type userPersonalBalance struct {
	PersonalBalance int
	User            *model.User
}