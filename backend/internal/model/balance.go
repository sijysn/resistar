package model

import (
	"time"

	"gorm.io/gorm"
)

type Balance struct {
	ID        uint           `gorm:"primaryKey"`
  CreatedAt time.Time
  UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Amount    int
	HistoryID uint
  UserID    uint
	GroupID   uint
}