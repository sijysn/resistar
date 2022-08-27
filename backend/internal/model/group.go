package model

import (
	"time"

	"gorm.io/gorm"
)

type Group struct {
	ID        uint           `gorm:"primaryKey"`
  CreatedAt time.Time
  UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Name string
}