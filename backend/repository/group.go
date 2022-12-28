package repository

import "github.com/sijysn/resistar/backend/entity"

type GetGroupByIDInput struct {
	GroupID uint
}

func (r *Repository) GetGroupByID(input GetGroupByIDInput) (*entity.Group, error) {
	var group *entity.Group
	err := r.DB.Debug().Where("id = ?", input.GroupID).Limit(1).First(&group).Error
	if err != nil {
		return nil, err
	}
	return group, nil
}

type GetGroupWithUsersByIDInput struct {
	GroupID uint
}

func (r *Repository) GetGroupWithUsersByID(input GetGroupWithUsersByIDInput) (*entity.Group, error) {
	var group *entity.Group
	err := r.DB.Debug().Where("id = ?", input.GroupID).Preload("Users").Limit(1).Find(&group).Error
	if err != nil {
		return nil, err
	}
	return group, nil
}

type GetGroupWithUsersByIDAndUserIDInput struct {
	GroupID uint
	UserID uint
}

func (r *Repository) GetGroupWithUsersByIDAndUserID(input GetGroupWithUsersByIDAndUserIDInput) (*entity.Group, error) {
	var group *entity.Group
	err := r.DB.Debug().Where("id = ?", input.GroupID).Preload("Users", "id = ?", input.UserID).Limit(1).First(&group).Error
	if err != nil {
		return nil, err
	}
	return group, nil
}

type GetGroupsByIDsInput struct {
	GroupIDs []uint
}

func (r *Repository) GetGroupsByIDs(input GetGroupsByIDsInput) ([]entity.Group, error) {
	var groups []entity.Group
	err := r.DB.Where("id IN ?", input.GroupIDs).Preload("Users").Find(&groups).Order("created_at DESC").Error
	if err != nil {
		return nil, err
	}
	return groups, nil
}

type AddUserAssociationInput struct {
	Group *entity.Group
	User *entity.User
}

func (r *Repository) AddUserAssociation(input AddUserAssociationInput) error {
	err := r.DB.Model(input.Group).Association("Users").Append(input.User)
	if err != nil {
		return err
	}
	return nil
}
