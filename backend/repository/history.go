package repository

import "github.com/sijysn/resistar/backend/entity"

type GetHistoriesByGroupIDInput struct {
	Year string
	Month string
	GroupID uint
}

func (r *Repository) GetHistoriesByGroupID(input GetHistoriesByGroupIDInput) ([]entity.History, error) {
	var histories []entity.History
	err := r.DB.Debug().Preload("FromUsers").Preload("ToUsers").Where("group_id = ? AND date_part('year', created_at) = ? AND date_part('month', created_at) = ?", input.GroupID, input.Year, input.Month).Order("created_at DESC").Find(&histories).Error
	if err != nil {
		return nil, err
	}
	return histories, nil
}