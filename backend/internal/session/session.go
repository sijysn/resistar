package session

type session struct {
	SessionToken *string
	UserID *uint
	GroupID *uint
}

var Session = session{}