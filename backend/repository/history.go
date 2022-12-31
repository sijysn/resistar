package repository

import (
	"github.com/sijysn/resistar/backend/entity"
	"github.com/sijysn/resistar/backend/graph/model"
)

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

type CreateHistoryInput struct {
	Title string
	Type model.Type
	Price int
	GroupID uint
}

func (r *Repository) CreateHistory(input CreateHistoryInput) (*entity.History, error) {
	newHistory := &entity.History{
		Title:   input.Title,
		Type:    model.Type(input.Type),
		Price:   input.Price,
		GroupID: input.GroupID,
	}
	err := r.DB.Debug().Create(newHistory).Error
	if err != nil {
		return nil, err
	}
	return newHistory, err
}

type AddFromUsersAssociationInput struct {
	History *entity.History
	Users []entity.User
}

func (r *Repository) AddFromUsersAssociation(input AddFromUsersAssociationInput) error {
	err := r.DB.Debug().Model(input.History).Association("FromUsers").Append(input.Users)
	if err != nil {
		return err
	}
	return nil
}

type AddToUsersAssociationInput struct {
	History *entity.History
	Users []entity.User
}

func (r *Repository) AddToUsersAssociation(input AddToUsersAssociationInput) error {
	err := r.DB.Debug().Model(input.History).Association("ToUsers").Append(input.Users)
	if err != nil {
		return err
	}
	return nil
}