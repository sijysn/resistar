package usecase

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/middleware"
	"github.com/sijysn/resistar/backend/repository"
	"github.com/sijysn/resistar/backend/utility"
)

func (u *UsecaseRepository) JoinGroup(ctx context.Context, input model.JoinGroup) (*model.Result, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	if responseAccess.Status == auth.StatusUnauthorized {
		errorMessage := "認証されていません"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	userID, err := utility.ParseStringToUint(input.UserID)
	if err != nil {
		return nil, err
	}

	// ユーザーが存在するかチェックする
	getUserByIDInput := repository.GetUserByIDInput{
		UserID: userID,
	}
	dbUser, err := u.Repository.GetUserByID(getUserByIDInput)
	if err != nil {
		errorMessage := "メールアドレスまたはパスワードが違います"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	groupID, err := utility.ParseStringToUint(input.GroupID)
	if err != nil {
		return nil, err
	}

	// グループが存在するかチェックする
	getGroupByIDInput := repository.GetGroupByIDInput{
		GroupID: groupID,
	}
	dbGroup, err := u.Repository.GetGroupByID(getGroupByIDInput)
	if err != nil {
		errorMessage := "無効なグループです"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	// ユーザーがグループに参加しているかチェックする
	getGroupWithUsersByIDAndUserIDInput := repository.GetGroupWithUsersByIDAndUserIDInput{
		GroupID: groupID,
		UserID: userID,
	}
	dbGroup, err = u.Repository.GetGroupWithUsersByIDAndUserID(getGroupWithUsersByIDAndUserIDInput)
	if err != nil {
		errorMessage := "このメールアドレスに対してこの操作はできません"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	getInvitedUsersByGroupIDAndUserID := repository.GetInvitedUsersByGroupIDAndUserIDInput{
		GroupID: groupID,
		UserID: userID,
	}
	dbInvitedUsers, err := u.Repository.GetInvitedUsersByGroupIDAndUserID(getInvitedUsersByGroupIDAndUserID)
	if err != nil {
		return nil, err
	}
	if len(dbInvitedUsers) == 1 && !dbInvitedUsers[0].Joined {
		addUserAssociationInput := repository.AddUserAssociationInput{
			Group: dbGroup,
			User: dbUser,
		}
		err = u.Repository.AddUserAssociation(addUserAssociationInput)
		if err != nil {
			return nil, err
		}
		dbInvitedUsers[0].Joined = true
		saveInvitedUserInput := repository.SaveInvitedUserInput{
			InvitedUser: dbInvitedUsers[0],
		}
		err = u.Repository.SaveInvitedUser(saveInvitedUserInput)
		if err != nil {
			return nil, err
		}

		signBytes, err := ioutil.ReadFile("./jwt.pem")
		if err != nil {
			panic(err)
		}

		signKey, err := jwt.ParseRSAPrivateKeyFromPEM(signBytes)
		if err != nil {
			panic(err)
		}

		sessionToken := utility.GenerateToken()
		claims := jwt.MapClaims{
			"sessionToken": sessionToken,
			"userID":       uint(userID),
			"groupID":      uint(groupID),
			"exp":          time.Now().AddDate(0, 1, 0).Unix(),
		}
		token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
		jwtToken, err := token.SignedString(signKey)
		if err != nil {
			panic(err)
		}

		createGroupLoginLogInput := repository.CreateGroupLoginLogInput{
			UserID:  userID,
			GroupID: groupID,
			Token:   utility.SHA512(sessionToken),
		}
		err = u.Repository.CreateGroupLoginLog(createGroupLoginLogInput)
		if err != nil {
			return nil, err
		}

		responseAccess.SetCookie("jwtToken", jwtToken, false, time.Now().Add(24*time.Hour))
		responseAccess.SetCookie("groupID", input.GroupID, false, time.Now().Add(24*time.Hour))
		responseAccess.Writer.WriteHeader(http.StatusOK)

		message := "グループに参加しました"
		return &model.Result{
			Message: message,
			Success: true,
		}, nil
	}
	errorMessage := "無効なメールアドレスです"
	return &model.Result{
		Message: errorMessage,
		Success: false,
	}, nil
}