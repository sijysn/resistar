package entity

import (
	"time"

	"gorm.io/gorm"
)

type UserLoginLog struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	UserID    uint
	Token     string
}
