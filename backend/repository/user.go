package repository

import (
	"strconv"

	"github.com/sijysn/resistar/backend/entity"
	"github.com/sijysn/resistar/backend/graph/model"
)

func(repository *Repository) GetUsers(input model.UsersQuery)([]*model.User, error) {
	var users []*model.User
	var dbGroup *entity.Group
	groupID, err := strconv.ParseUint(input.GroupID, 10, 64)
	if err != nil {
		return nil, err
	}
	err = repository.DB.Debug().Where("id = ?", uint(groupID)).Preload("Users").Limit(1).Find(&dbGroup).Error
	if err != nil {
		return nil, err
	}
	for _, dbUser := range dbGroup.Users {
		users = append(users, &model.User{
			ID:       strconv.FormatUint(uint64(dbUser.ID), 10),
			Email:    dbUser.Email,
			Name:     dbUser.Name,
			ImageURL: dbUser.ImageURL,
		})
	}
	return users, nil
}