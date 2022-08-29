package sql

import (
	"time"

	"github.com/sijysn/resistar/backend/internal/model"
	"gorm.io/gorm"
)

func AddBalances(db *gorm.DB, price int, fromUsers []model.User, toUsers []model.User, createdAt time.Time, updatedAt time.Time, historyID uint, groupID uint) error {
	fromUsersLength := len(fromUsers)
	var balances []model.Balance
	for _, v := range fromUsers {
		balance := model.Balance{
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
		balance := model.Balance{
			CreatedAt: createdAt,
			UpdatedAt: updatedAt,
			Amount:   -(price / toUsersLength),
			HistoryID: historyID,
			UserID:    v.ID,
			GroupID:   groupID,
		}
		balances = append(balances, balance)
	}
	err := db.Create(&balances).Error
	if err != nil {
		return err
	}
	return nil
}