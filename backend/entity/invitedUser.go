package entity

import "time"

type InvitedUser struct {
	ID        uint           `gorm:"primaryKey"`
	GroupID   uint
	UserID    uint
	Joined    bool
	CreatedAt time.Time
}