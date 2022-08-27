package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey"`
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt gorm.DeletedAt `gorm:"index"`
	Name string `json:"name"`
	Email string `json:"email"`
	Password string `json:"password"`
	ImageURL string `json:"imageUrl"`
	GroupID uint
}