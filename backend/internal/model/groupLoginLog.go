package model

import (
	"time"

	"gorm.io/gorm"
)

type GroupLoginLog struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	UserID    uint
	GroupID   uint
	Token     string
}
