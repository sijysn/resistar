package model

import (
	"time"

	"gorm.io/gorm"
)

type Expense struct {
	ID        uint           `gorm:"primaryKey"`
  CreatedAt time.Time
  UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Expense int
	HistoryID uint
  UserID uint
	GroupID uint
}