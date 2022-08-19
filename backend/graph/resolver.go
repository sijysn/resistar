package graph

import (
	"time"

	"gorm.io/gorm"

	dbModel "github.com/sijysn/resistar/backend/internal/model"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Resolver has DB
type Resolver struct{
	DB *gorm.DB
}

func (r *Resolver) addBalances(price int, fromUsers []dbModel.User, toUsers []dbModel.User, createdAt time.Time, updatedAt time.Time, historyID uint, groupID uint) error {
	fromUsersLength := len(fromUsers)
	var balances []dbModel.Balance
	for _, v := range fromUsers {
		balance := dbModel.Balance{
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
		balance := dbModel.Balance{
			CreatedAt: createdAt,
			UpdatedAt: updatedAt,
			Amount:   -(price / toUsersLength),
			HistoryID: historyID,
			UserID:    v.ID,
			GroupID:   groupID,
		}
		balances = append(balances, balance)
	}
	err := r.DB.Create(&balances).Error
	if err != nil {
		return err
	}
	return nil
}
