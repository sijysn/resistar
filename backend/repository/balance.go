package repository

import "github.com/sijysn/resistar/backend/graph/model"

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