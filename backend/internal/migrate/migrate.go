package migrate

import (
	"github.com/sijysn/resistar/backend/internal/model"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) {
	db.AutoMigrate(&model.History{}, &model.User{})
}