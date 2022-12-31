package repository

import (
	"github.com/sijysn/resistar/backend/entity"
	"github.com/sijysn/resistar/backend/graph/model"
)

type ScanPersonalBalanceInput struct {
	Year    string
	Month   string
	UserID  uint
	GroupID uint
	Amounts *model.Amounts
}

func (r *Repository) ScanPersonalBalance(input ScanPersonalBalanceInput) (*model.Amounts, error) {
	err := r.DB.Debug().Table("balances").Select("SUM(amount) as personal_balance").Where("group_id = ? AND user_id = ? AND date_part('year', created_at) = ? AND date_part('month', created_at) = ?", input.GroupID, input.UserID, input.Year, input.Month).Scan(&input.Amounts).Error
	if err != nil {
		return nil, err
	}
	return input.Amounts, nil
}

type PersonalBalanceWithUserInfo struct {
	PersonalBalance int
	ID              uint
	Email           string
	Name            string
}

type ScanPersonalBalancesWithUserInfoInput struct {
	Year    string
	Month   string
	GroupID uint
	PersonalBalancesWithUserInfo []*PersonalBalanceWithUserInfo
}

func (r *Repository) ScanPersonalBalancesWithUserInfo(input ScanPersonalBalancesWithUserInfoInput) ([]*PersonalBalanceWithUserInfo, error) {
	err := r.DB.Debug().Table("balances").Select("SUM(balances.amount) as personal_balance, users.id, users.email, users.name").Where("balances.group_id = ? AND date_part('year', balances.created_at) = ? AND date_part('month', balances.created_at) = ?", input.GroupID, input.Year, input.Month).Joins("LEFT JOIN users ON users.id = balances.user_id").Group("users.id").Scan(&input.PersonalBalancesWithUserInfo).Error
	if err != nil {
		return nil, err
	}
	return input.PersonalBalancesWithUserInfo, nil
}

type ScanGroupTotalInput struct {
	Year    string
	Month   string
	GroupID uint
	Amounts *model.Amounts
}

func (r *Repository) ScanGroupTotal(input ScanGroupTotalInput) (*model.Amounts, error) {
	err := r.DB.Debug().Table("balances").Select("SUM(amount) as group_total").Where("group_id = ? AND date_part('year', created_at) = ? AND date_part('month', created_at) = ? AND amount > 0", input.GroupID, input.Year, input.Month).Scan(&input.Amounts).Error
	if err != nil {
		return nil, err
	}
	return input.Amounts, nil
}
type CreateBalancesInput struct {
	Balances []entity.Balance
}
func (r *Repository) CreateBalances(input CreateBalancesInput) ([]entity.Balance, error) {
	err := r.DB.Debug().Create(&input.Balances).Error
	if err != nil {
		return nil, err
	}
	return input.Balances, nil
}