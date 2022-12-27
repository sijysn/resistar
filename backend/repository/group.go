package repository

import "github.com/sijysn/resistar/backend/entity"

type GetGroupByIDInput struct {
	GroupID uint
}

func(r *Repository) GetGroupByID(input GetGroupByIDInput) (*entity.Group, error) {
	var group *entity.Group
	err := r.DB.Debug().Where("id = ?", input.GroupID).Preload("Users").Limit(1).Find(&group).Error
	if err != nil {
		return nil, err
	}
	return group, nil
}