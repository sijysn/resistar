package migrate

import (
	"github.com/sijysn/resistar/backend/entity"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) {
	db.AutoMigrate(&entity.History{}, &entity.User{}, &entity.Group{}, &entity.Balance{}, &entity.InvitedUser{}, &entity.UserLoginLog{}, &entity.GroupLoginLog{})
}
