package repository

import (
	"github.com/sijysn/resistar/backend/entity"
	"github.com/sijysn/resistar/backend/graph/model"
)

type Queries interface {
	GetUsers(input GetUsersInput) ([]entity.User, error)
	GetUserByID(input GetUserByIDInput) (*entity.User, error)
	GetUserWithGroupsByID(input GetUserWithGroupsByIDInput) (*entity.User, error)
	GetUserByEmailAndPassword(input GetUserByEmailAndPasswordInput) ([]entity.User, error)
	GetGroupByID(input GetGroupByIDInput) (*entity.Group, error)
	GetGroupWithUsersByID(input GetGroupWithUsersByIDInput) (*entity.Group, error)
	GetGroupWithUsersByIDAndUserID(input GetGroupWithUsersByIDAndUserIDInput) (*entity.Group, error)
	GetGroupsByIDs(input GetGroupsByIDsInput) ([]entity.Group, error)
	AddUserAssociation(input AddUserAssociationInput) error
	GetHistoriesByGroupID(input GetHistoriesByGroupIDInput) ([]entity.History, error)
	ScanPersonalBalance(input ScanPersonalBalanceInput) (*model.Amounts, error)
	ScanPersonalBalancesWithUserInfo(input ScanPersonalBalancesWithUserInfoInput) ([]*PersonalBalanceWithUserInfo, error)
	ScanGroupTotal(input ScanGroupTotalInput) (*model.Amounts, error)
	GetInvitedUsersByUserID(input GetInvitedUsersByUserIDInput) ([]entity.InvitedUser, error)
	GetInvitedUsersByGroupIDAndUserID(input GetInvitedUsersByGroupIDAndUserIDInput) ([]entity.InvitedUser, error)
	SaveInvitedUser(input SaveInvitedUserInput) error
	CreateUserLoginLog(input CreateUserLoginLogInput) error
	CreateGroupLoginLog(input CreateGroupLoginLogInput) error
}