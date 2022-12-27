package repository

import (
	"strconv"

	"github.com/sijysn/resistar/backend/entity"
	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/digest"
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

func(repository *Repository) GetUserByEmailAndPassword(input model.LoginUser) ([]*entity.User, error) {
	var dbUsers []*entity.User
	err := repository.DB.Debug().Where("email = ? AND password = ?", input.Email, digest.SHA512(input.Password)).Limit(1).Find(&dbUsers).Error
	if err != nil {
		return nil, err
	}
	return dbUsers, nil
}