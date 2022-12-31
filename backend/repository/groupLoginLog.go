package repository

import "github.com/sijysn/resistar/backend/entity"

type GetGroupLoginLogInput struct {
	Token string
	UserID uint
	GroupID uint
}

func (r *Repository) GetGroupLoginLog(input GetGroupLoginLogInput) (*entity.GroupLoginLog, error) {
	var groupLoginLog *entity.GroupLoginLog
	err := r.DB.Where("token = ? AND user_id = ? AND group_id = ?", input.Token, input.UserID, input.GroupID).Order("created_at DESC").Limit(1).Find(&groupLoginLog).Error
	if err != nil {
		return nil, err
	}
	return groupLoginLog, nil
}

type CreateGroupLoginLogInput struct {
	UserID uint
	GroupID uint
	Token string 
}

func (r *Repository) CreateGroupLoginLog(input CreateGroupLoginLogInput) error {
	loginLog := &entity.GroupLoginLog{
		UserID: input.UserID,
		GroupID: input.GroupID,
		Token:  input.Token,
	}
	err := r.DB.Debug().Create(loginLog).Error
	if err != nil {
		return err
	}
	return nil
}