package repository

import (
	"github.com/sijysn/resistar/backend/entity"
	"github.com/sijysn/resistar/backend/graph/model"
)

type Queries interface {
	GetUsers(input GetUsersInput) ([]entity.User, error)
	GetUser(input GetUserInput) (*entity.User, error)
	GetUserWithGroupsByID(input GetUserWithGroupsByIDInput) (*entity.User, error)
	GetUserByEmail(input GetUserByEmailInput) (*entity.User, error)
	GetUserByEmailAndPassword(input GetUserByEmailAndPasswordInput) ([]entity.User, error)
	CreateUser(input CreateUserInput) (*entity.User, error)
	GetGroupByID(input GetGroupByIDInput) (*entity.Group, error)
	GetGroupWithUsersByID(input GetGroupWithUsersByIDInput) (*entity.Group, error)
	GetGroupWithUsersByIDAndUserID(input GetGroupWithUsersByIDAndUserIDInput) (*entity.Group, error)
	GetGroupsByIDs(input GetGroupsByIDsInput) ([]entity.Group, error)
	AddUserAssociation(input AddUserAssociationInput) error
	CreateGroup(input CreateGroupInput) (*entity.Group, error)
	GetHistoriesByGroupID(input GetHistoriesByGroupIDInput) ([]entity.History, error)
	CreateHistory(input CreateHistoryInput) (*entity.History, error)
	DeleteHistory(input DeleteHistoryInput) error
	AddFromUsersAssociation(input AddFromUsersAssociationInput) error
	AddToUsersAssociation(input AddToUsersAssociationInput) error
	ScanPersonalBalance(input ScanPersonalBalanceInput) (*model.Amounts, error)
	ScanPersonalBalancesWithUserInfo(input ScanPersonalBalancesWithUserInfoInput) ([]*PersonalBalanceWithUserInfo, error)
	ScanGroupTotal(input ScanGroupTotalInput) (*model.Amounts, error)
	CreateBalances(input CreateBalancesInput) ([]entity.Balance, error)
	InviteUser(input InviteUserInput) (error)
	GetInvitedUsersByUserID(input GetInvitedUsersByUserIDInput) ([]entity.InvitedUser, error)
	GetInvitedUsersByGroupIDAndUserID(input GetInvitedUsersByGroupIDAndUserIDInput) ([]entity.InvitedUser, error)
	SaveInvitedUser(input SaveInvitedUserInput) error
	GetUserLoginLog(input GetUserLoginLogInput) (*entity.UserLoginLog, error)
	CreateUserLoginLog(input CreateUserLoginLogInput) error
	GetGroupLoginLog(input GetGroupLoginLogInput) (*entity.GroupLoginLog, error)
	CreateGroupLoginLog(input CreateGroupLoginLogInput) error
}