package model

import (
	"time"

	"gorm.io/gorm"

	model "github.com/sijysn/resistar/backend/graph/model"
)

type History struct {
	ID        uint           `gorm:"primaryKey"`
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt gorm.DeletedAt `gorm:"index"`
	Title     string  `json:"title"`
	Type      model.Type    `json:"type"`
	Price     int     `json:"price"`
	FromUsers []User `json:"fromUsers" gorm:"many2many:history_from_users"`
	ToUsers   []User `json:"toUsers" gorm:"many2many:history_to_users"`
	GroupID uint
}

type HistoryForScan struct {
	ID        uint           `gorm:"primaryKey"`
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt gorm.DeletedAt `gorm:"index"`
	Title     string  `json:"title"`
	Type      model.Type    `json:"type"`
	Price     int     `json:"price"`
}