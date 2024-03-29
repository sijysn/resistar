package graph

import (
	"github.com/alexedwards/scs/v2"
	"github.com/sijysn/resistar/backend/usecase"
	"gorm.io/gorm"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Resolver has DB
type Resolver struct{
	DB *gorm.DB
	Session *scs.SessionManager
	Usecase usecase.Usecases
}
