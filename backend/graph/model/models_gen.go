// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"fmt"
	"io"
	"strconv"
)

type Amounts struct {
	PersonalBalance int     `json:"personalBalance"`
	GroupTotal      int     `json:"groupTotal"`
	ErrorMessage    *string `json:"errorMessage"`
}

type AmountsQuery struct {
	Year    string `json:"year"`
	Month   string `json:"month"`
	UserID  string `json:"userID"`
	GroupID string `json:"groupID"`
}

type Balance struct {
	ID           string  `json:"id"`
	CreatedAt    string  `json:"createdAt"`
	UpdatedAt    *string `json:"updatedAt"`
	DeletedAt    *string `json:"deletedAt"`
	Amount       int     `json:"amount"`
	HistoryID    string  `json:"historyID"`
	UserID       string  `json:"userID"`
	GroupID      string  `json:"groupID"`
	ErrorMessage *string `json:"errorMessage"`
}

type Group struct {
	ID           string  `json:"id"`
	Name         string  `json:"name"`
	CreatedAt    string  `json:"createdAt"`
	UpdatedAt    *string `json:"updatedAt"`
	DeletedAt    *string `json:"deletedAt"`
	Users        []*User `json:"users"`
	ErrorMessage *string `json:"errorMessage"`
}

type GroupsQuery struct {
	UserID string `json:"userID"`
}

type HistoriesQuery struct {
	Year    string `json:"year"`
	Month   string `json:"month"`
	GroupID string `json:"groupID"`
}

type History struct {
	ID           string  `json:"id"`
	Title        string  `json:"title"`
	Type         Type    `json:"type"`
	Price        int     `json:"price"`
	FromUsers    []*User `json:"fromUsers"`
	ToUsers      []*User `json:"toUsers"`
	CreatedAt    string  `json:"createdAt"`
	UpdatedAt    *string `json:"updatedAt"`
	DeletedAt    *string `json:"deletedAt"`
	GroupID      string  `json:"groupID"`
	ErrorMessage *string `json:"errorMessage"`
}

type InitGroup struct {
	UserID    string `json:"userID"`
	GroupName string `json:"groupName"`
}

type InviteUserToGroupInput struct {
	Email   string `json:"email"`
	GroupID string `json:"groupID"`
}

type JoinGroup struct {
	UserID  string `json:"userID"`
	GroupID string `json:"groupID"`
}

type LoginGroup struct {
	UserID  string `json:"userID"`
	GroupID string `json:"groupID"`
}

type LoginUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type NewHistory struct {
	Title       string   `json:"title"`
	Type        Type     `json:"type"`
	Price       int      `json:"price"`
	FromUserIds []string `json:"fromUserIds"`
	ToUserIds   []string `json:"toUserIds"`
	GroupID     string   `json:"groupID"`
}

type NewUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Result struct {
	Message string `json:"message"`
	Success bool   `json:"success"`
}

type User struct {
	ID           string   `json:"id"`
	Name         string   `json:"name"`
	Email        string   `json:"email"`
	Password     string   `json:"password"`
	ImageURL     string   `json:"imageURL"`
	CreatedAt    string   `json:"createdAt"`
	UpdatedAt    *string  `json:"updatedAt"`
	DeletedAt    *string  `json:"deletedAt"`
	Groups       []*Group `json:"groups"`
	ErrorMessage *string  `json:"errorMessage"`
}

type UsersQuery struct {
	GroupID string `json:"groupID"`
}

type Type string

const (
	TypeDiary         Type = "DIARY"
	TypeTravel        Type = "TRAVEL"
	TypeRent          Type = "RENT"
	TypeUtility       Type = "UTILITY"
	TypeCommunication Type = "COMMUNICATION"
	TypeFood          Type = "FOOD"
	TypeOthers        Type = "OTHERS"
)

var AllType = []Type{
	TypeDiary,
	TypeTravel,
	TypeRent,
	TypeUtility,
	TypeCommunication,
	TypeFood,
	TypeOthers,
}

func (e Type) IsValid() bool {
	switch e {
	case TypeDiary, TypeTravel, TypeRent, TypeUtility, TypeCommunication, TypeFood, TypeOthers:
		return true
	}
	return false
}

func (e Type) String() string {
	return string(e)
}

func (e *Type) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = Type(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid Type", str)
	}
	return nil
}

func (e Type) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
