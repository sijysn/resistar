package usecase

import (
	"context"
	"fmt"
	"net/http"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-ozzo/ozzo-validation/is"
	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/middleware"
	"github.com/sijysn/resistar/backend/repository"
	"github.com/sijysn/resistar/backend/utility"
)

func (u *UsecaseRepository) AddUser(ctx context.Context, input model.NewUser) (*model.Result, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}

	err := validation.Validate(
		input.Email,
		validation.Required,
		validation.Length(5, 100),
		is.Email,
	)
	if err != nil {
		return nil, err
	}

	getUserByEmailInput := repository.GetUserByEmailInput{
		Email: input.Email,
	}
	_, err = u.Repository.GetUserByEmail(getUserByEmailInput)
	if err != nil {
		errorMessage := "このメールアドレスのユーザーは存在しません"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	password := utility.SHA512(input.Password)
	createUserInput := repository.CreateUserInput{
		Email:    input.Email,
		Password: password,
	}
	_, err = u.Repository.CreateUser(createUserInput)
	if err != nil {
		return nil, err
	}

	result, err := u.LoginUser(ctx, model.LoginUser{Email: input.Email, Password: input.Password})
	if err != nil {
		return nil, err
	}
	return result, nil
}