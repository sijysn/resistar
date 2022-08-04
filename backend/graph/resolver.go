package graph

import "github.com/sijysn/resistar/backend/graph/model"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Resolver is
type Resolver struct{
	histories []*model.History
	users []*model.User
}
