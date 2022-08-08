package model

import (
	"fmt"
	"io"
	"strconv"

	"gorm.io/gorm"
)

type History struct {
	gorm.Model
	Title     string  `json:"title"`
	Type      Type    `json:"type"`
	Price     int     `json:"price"`
	FromUsers []*User `json:"fromUsers" gorm:"foreignKey:ID"`
	ToUsers   []*User `json:"toUsers" gorm:"foreignKey:ID"`
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
