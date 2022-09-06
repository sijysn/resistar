package model

import (
	"time"

	"gorm.io/gorm"
)

type LoginLog struct {
	ID        uint           `gorm:"primaryKey"`
	UserID    uint
	GroupID   uint
	AccessToken string
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt gorm.DeletedAt `gorm:"index"`
}