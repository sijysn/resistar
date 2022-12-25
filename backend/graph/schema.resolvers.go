package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"sort"
	"strconv"
	"time"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-ozzo/ozzo-validation/is"
	"github.com/golang-jwt/jwt"
	"github.com/sijysn/resistar/backend/graph/generated"
	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/digest"
	"github.com/sijysn/resistar/backend/internal/middleware"
	dbModel "github.com/sijysn/resistar/backend/internal/model"
	"github.com/sijysn/resistar/backend/internal/session"
	"github.com/sijysn/resistar/backend/internal/sql"
)

// AddHistory is the resolver for the addHistory field.
func (r *mutationResolver) AddHistory(ctx context.Context, input model.NewHistory) (*model.History, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	if responseAccess.Status != auth.StatusGroup {
		errorMessage := "認証されていません"
		return &model.History{
			ErrorMessage: &errorMessage,
		}, nil
	}

	var dbFromUsers []dbModel.User
	err := r.DB.Where(input.FromUserIds).Find(&dbFromUsers).Error
	if err != nil {
		return nil, err
	}

	var dbToUsers []dbModel.User
	err = r.DB.Where(input.ToUserIds).Find(&dbToUsers).Error
	if err != nil {
		return nil, err
	}

	groupID, err := strconv.ParseUint(input.GroupID, 10, 64)
	if err != nil {
		return nil, err
	}

	dbNewHistory := &dbModel.History{
		Title:   input.Title,
		Type:    model.Type(input.Type),
		Price:   input.Price,
		GroupID: uint(groupID),
	}

	var newHistory *model.History
	err = r.DB.Create(dbNewHistory).Error
	if err != nil {
		return nil, err
	}
	err = r.DB.Model(dbNewHistory).Association("FromUsers").Append(dbFromUsers)
	if err != nil {
		return nil, err
	}
	err = r.DB.Model(dbNewHistory).Association("ToUsers").Append(dbToUsers)
	if err != nil {
		return nil, err
	}

	err = sql.AddBalances(r.DB, input.Price, dbFromUsers, dbToUsers, dbNewHistory.CreatedAt, dbNewHistory.UpdatedAt, dbNewHistory.ID, uint(groupID))
	if err != nil {
		return nil, err
	}

	newHistory = &model.History{
		ID:        strconv.FormatUint(uint64(dbNewHistory.ID), 10),
		Title:     dbNewHistory.Title,
		Type:      dbNewHistory.Type,
		Price:     dbNewHistory.Price,
		CreatedAt: dbNewHistory.CreatedAt.Format("2006-01-02 15:04:05"),
	}

	return newHistory, nil
}

// AddUser is the resolver for the addUser field.
func (r *mutationResolver) AddUser(ctx context.Context, input model.NewUser) (*model.Result, error) {
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

	var dbUsers []dbModel.User
	count := r.DB.Where("email = ?", input.Email).Find(&dbUsers).RowsAffected
	if count != 0 {
		errorMessage := "このメールアドレスは既に登録されています"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	password := digest.SHA512(input.Password)
	dbNewUser := &dbModel.User{
		Email:    input.Email,
		Password: password,
	}
	err = r.DB.Create(dbNewUser).Error
	if err != nil {
		return nil, err
	}

	result, err := r.LoginUser(ctx, model.LoginUser{Email: input.Email, Password: input.Password})
	if err != nil {
		return nil, err
	}
	return result, nil
}

// AddGroup is the resolver for the addGroup field.
func (r *mutationResolver) AddGroup(ctx context.Context, input model.NewGroup) (*model.Result, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	if responseAccess.Status == auth.StatusUnauthorized {
		errorMessage := "認証されていません"
		return &model.Result{
			Message: errorMessage,
		}, nil
	}

	var dbUsers []dbModel.User
	userID, err := strconv.ParseUint(input.UserID, 10, 64)
	if err != nil {
		return nil, err
	}
	err = r.DB.Debug().Preload("Groups").Where("id = ?", uint(userID)).Find(&dbUsers).Error
	if err != nil {
		return nil, err
	}
	dbNewGroup := &dbModel.Group{
		Name: input.GroupName,
	}
	err = r.DB.Create(dbNewGroup).Error
	if err != nil {
		return nil, err
	}
	err = r.DB.Model(dbNewGroup).Association("Users").Append(dbUsers)
	if err != nil {
		return nil, err
	}
	dbGroupID := dbNewGroup.ID
	session.Session.GroupID = &dbGroupID

	groupID := strconv.FormatUint(uint64(dbNewGroup.ID), 10)

	signBytes, err := ioutil.ReadFile("./jwt.pem")
	if err != nil {
		panic(err)
	}

	signKey, err := jwt.ParseRSAPrivateKeyFromPEM(signBytes)
	if err != nil {
		panic(err)
	}

	sessionToken := digest.GenerateToken()
	claims := jwt.MapClaims{
		"sessionToken": sessionToken,
		"userID":       uint(userID),
		"groupID":      dbNewGroup.ID,
		"exp":          time.Now().AddDate(0, 1, 0).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	jwtToken, err := token.SignedString(signKey)
	if err != nil {
		panic(err)
	}

	loginLog := &dbModel.GroupLoginLog{
		UserID:  uint(userID),
		GroupID: dbNewGroup.ID,
		Token:   digest.SHA512(sessionToken),
	}
	err = r.DB.Create(loginLog).Error
	if err != nil {
		return nil, err
	}

	responseAccess.SetCookie("jwtToken", jwtToken, false, time.Now().Add(24*time.Hour))
	responseAccess.SetCookie("groupID", groupID, false, time.Now().Add(24*time.Hour))
	responseAccess.Writer.WriteHeader(http.StatusOK)

	message := "グループを作成しました"
	return &model.Result{
		Message: message,
		Success: true,
	}, nil
}

// InviteUserToGroup is the resolver for the inviteUserToGroup field.
func (r *mutationResolver) InviteUserToGroup(ctx context.Context, input model.InviteUserToGroupInput) (*model.Result, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	if responseAccess.Status != auth.StatusGroup {
		errorMessage := "認証されていません"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
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

	// ユーザーが存在するかチェックする
	var dbUsers []dbModel.User
	err = r.DB.Where("email = ?", input.Email).Limit(1).Find(&dbUsers).Error
	if err != nil {
		return nil, err
	}
	if len(dbUsers) == 0 {
		errorMessage := "このメールアドレスは登録されていません"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	groupID, err := strconv.ParseUint(input.GroupID, 10, 64)
	if err != nil {
		return nil, err
	}

	// グループが存在するかチェックする
	var dbGroups []dbModel.Group
	err = r.DB.Where("id = ?", uint(groupID)).Limit(1).Find(&dbGroups).Error
	if err != nil {
		return nil, err
	}
	if len(dbGroups) == 0 {
		errorMessage := "無効なグループです"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	// ユーザーがグループに参加しているかチェックする
	var dbGroup *dbModel.Group
	err = r.DB.Debug().Where("id = ?", uint(groupID)).Preload("Users", "email = ?", input.Email).Limit(1).Find(&dbGroup).Error
	if err != nil {
		return nil, err
	}
	if len(dbGroup.Users) == 1 {
		errorMessage := "このメールアドレスのユーザーは招待できません"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	var dbInvitedUsers []dbModel.InvitedUser
	userID := dbUsers[0].ID
	err = r.DB.Debug().Where("group_id = ? AND user_id = ?", uint(groupID), userID).Order("created_at DESC").Limit(1).Find(&dbInvitedUsers).Error
	if err != nil {
		return nil, err
	}
	// まだ招待されてないか、退会済みの場合
	if len(dbInvitedUsers) == 0 || dbInvitedUsers[0].Joined {
		dbNewInvitedUser := &dbModel.InvitedUser{
			GroupID: uint(groupID),
			UserID:  userID,
			Joined:  false,
		}
		err = r.DB.Create(dbNewInvitedUser).Error
		if err != nil {
			return nil, err
		}
		message := "招待メールを送りました"
		return &model.Result{
			Message: message,
			Success: true,
		}, nil
	}
	errorMessage := "このメールアドレスのユーザーは招待できません"
	return &model.Result{
		Message: errorMessage,
		Success: false,
	}, nil
}

// JoinGroup is the resolver for the joinGroup field.
func (r *mutationResolver) JoinGroup(ctx context.Context, input model.JoinGroup) (*model.Result, error) {
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

	userID, err := strconv.ParseUint(input.UserID, 10, 64)
	if err != nil {
		return nil, err
	}
	// ユーザーが存在するかチェックする
	var dbUsers []dbModel.User
	err = r.DB.Where("id = ?", uint(userID)).Limit(1).Find(&dbUsers).Error
	if err != nil {
		return nil, err
	}
	if len(dbUsers) == 0 {
		errorMessage := "メールアドレスまたはパスワードが違います"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	groupID, err := strconv.ParseUint(input.GroupID, 10, 64)
	if err != nil {
		return nil, err
	}

	// グループが存在するかチェックする
	var dbGroups []dbModel.Group
	err = r.DB.Where("id = ?", uint(groupID)).Limit(1).Find(&dbGroups).Error
	if err != nil {
		return nil, err
	}
	if len(dbGroups) == 0 {
		errorMessage := "無効なグループです"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	// ユーザーがグループに参加しているかチェックする
	var dbGroup *dbModel.Group
	err = r.DB.Debug().Where("id = ?", uint(groupID)).Preload("Users", "id = ?", uint(userID)).Limit(1).Find(&dbGroup).Error
	if err != nil {
		return nil, err
	}
	if len(dbGroup.Users) == 1 {
		errorMessage := "このメールアドレスに対してこの操作はできません"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	var dbInvitedUsers []dbModel.InvitedUser
	err = r.DB.Debug().Where("group_id = ? AND user_id = ?", uint(groupID), uint(userID)).Order("created_at DESC").Limit(1).Find(&dbInvitedUsers).Error
	if err != nil {
		return nil, err
	}
	if len(dbInvitedUsers) == 1 && !dbInvitedUsers[0].Joined {
		err = r.DB.Model(dbGroup).Association("Users").Append(&dbUsers)
		if err != nil {
			return nil, err
		}
		dbInvitedUsers[0].Joined = true
		err = r.DB.Save(dbInvitedUsers[0]).Error
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

		sessionToken := digest.GenerateToken()
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

		loginLog := &dbModel.GroupLoginLog{
			UserID:  uint(userID),
			GroupID: uint(groupID),
			Token:   digest.SHA512(sessionToken),
		}
		err = r.DB.Create(loginLog).Error
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

// LoginUser is the resolver for the loginUser field.
func (r *mutationResolver) LoginUser(ctx context.Context, input model.LoginUser) (*model.Result, error) {
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

	// ユーザーが存在するかチェックする
	var dbUsers []dbModel.User
	count := r.DB.Where("email = ? AND password = ?", input.Email, digest.SHA512(input.Password)).Limit(1).Find(&dbUsers).RowsAffected
	if count != 1 {
		errorMessage := "メールアドレスまたはパスワードが違います"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	sessionToken := digest.GenerateToken()
	dbUser := dbUsers[0]
	userID := dbUser.ID
	session.Session.SessionToken = &sessionToken
	session.Session.UserID = &userID

	signBytes, err := ioutil.ReadFile("./jwt.pem")
	if err != nil {
		panic(err)
	}

	signKey, err := jwt.ParseRSAPrivateKeyFromPEM(signBytes)
	if err != nil {
		panic(err)
	}

	claims := jwt.MapClaims{
		"sessionToken": sessionToken,
		"userID":       uint(userID),
		"exp":          time.Now().AddDate(0, 1, 0).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	jwtToken, err := token.SignedString(signKey)
	if err != nil {
		panic(err)
	}

	loginLog := &dbModel.UserLoginLog{
		UserID: dbUsers[0].ID,
		Token:  digest.SHA512(sessionToken),
	}
	err = r.DB.Create(loginLog).Error
	if err != nil {
		return nil, err
	}

	responseAccess.SetCookie("jwtToken", jwtToken, false, time.Now().Add(24*time.Hour))
	id := strconv.FormatUint(uint64(userID), 10)
	responseAccess.SetCookie("userID", id, false, time.Now().Add(24*time.Hour))
	responseAccess.Writer.WriteHeader(http.StatusOK)

	message := "ログインに成功しました"
	return &model.Result{
		Message: message,
		Success: true,
	}, nil
}

// LoginGroup is the resolver for the loginGroup field.
func (r *mutationResolver) LoginGroup(ctx context.Context, input model.LoginGroup) (*model.Result, error) {
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

	groupID, err := strconv.ParseUint(input.GroupID, 10, 64)
	if err != nil {
		return nil, err
	}

	// グループが存在するかチェックする
	var dbGroups []dbModel.Group
	err = r.DB.Where("id = ?", uint(groupID)).Limit(1).Find(&dbGroups).Error
	if err != nil {
		return nil, err
	}
	if len(dbGroups) == 0 {
		errorMessage := "無効なグループです"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	// グループのメンバーかどうかチェックする
	userID, err := strconv.ParseUint(input.UserID, 10, 64)
	if err != nil {
		return nil, err
	}
	var dbGroup *dbModel.Group
	err = r.DB.Debug().Where("id = ?", uint(groupID)).Preload("Users", "id = ?", uint(userID)).Limit(1).Find(&dbGroup).Error
	if err != nil {
		return nil, err
	}
	if len(dbGroup.Users) != 1 {
		errorMessage := "このグループには入れません"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}

	signBytes, err := ioutil.ReadFile("./jwt.pem")
	if err != nil {
		panic(err)
	}

	signKey, err := jwt.ParseRSAPrivateKeyFromPEM(signBytes)
	if err != nil {
		panic(err)
	}

	sessionToken := digest.GenerateToken()
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

	loginLog := &dbModel.GroupLoginLog{
		UserID:  uint(userID),
		GroupID: uint(groupID),
		Token:   digest.SHA512(sessionToken),
	}
	err = r.DB.Create(loginLog).Error
	if err != nil {
		return nil, err
	}

	responseAccess.SetCookie("jwtToken", jwtToken, false, time.Now().Add(24*time.Hour))
	responseAccess.SetCookie("groupID", input.GroupID, false, time.Now().Add(24*time.Hour))
	responseAccess.Writer.WriteHeader(http.StatusOK)

	message := "グループにログインしました"
	return &model.Result{
		Message: message,
		Success: true,
	}, nil
}

// LogoutGroup is the resolver for the logoutGroup field.
func (r *mutationResolver) LogoutGroup(ctx context.Context) (*model.Result, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	if responseAccess.Status != auth.StatusGroup {
		errorMessage := "認証されていません"
		return &model.Result{
			Message: errorMessage,
			Success: false,
		}, nil
	}
	signBytes, err := ioutil.ReadFile("./jwt.pem")
	if err != nil {
		panic(err)
	}
	session.Session.GroupID = nil

	signKey, err := jwt.ParseRSAPrivateKeyFromPEM(signBytes)
	if err != nil {
		panic(err)
	}

	sessionToken := digest.GenerateToken()
	claims := jwt.MapClaims{
		"sessionToken": sessionToken,
		"userID":       &session.Session.UserID,
		"exp":          time.Now().AddDate(0, 1, 0).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	jwtToken, err := token.SignedString(signKey)
	if err != nil {
		panic(err)
	}
	responseAccess.SetCookie("jwtToken", jwtToken, false, time.Now().Add(24*time.Hour))
	responseAccess.DeleteCookie("groupID")
	responseAccess.Writer.WriteHeader(http.StatusOK)

	loginLog := &dbModel.UserLoginLog{
		UserID: *session.Session.UserID,
		Token:  digest.SHA512(sessionToken),
	}
	err = r.DB.Create(loginLog).Error
	if err != nil {
		return nil, err
	}
	
	message := "グループからログアウトしました"
	return &model.Result{
		Message: message,
		Success: true,
	}, nil
}

// Histories is the resolver for the histories field.
func (r *queryResolver) Histories(ctx context.Context, input model.HistoriesQuery) ([]*model.History, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	var histories []*model.History
	if responseAccess.Status != auth.StatusGroup {
		errorMessage := "認証されていません"
		histories = append(histories, &model.History{
			ErrorMessage: &errorMessage,
		})
		return histories, nil
	}

	var dbHistories []dbModel.History
	groupID, err := strconv.ParseUint(input.GroupID, 10, 64)
	if err != nil {
		return nil, err
	}
	err = r.DB.Debug().Preload("FromUsers").Preload("ToUsers").Where("group_id = ? AND date_part('year', created_at) = ? AND date_part('month', created_at) = ?", groupID, input.Year, input.Month).Order("created_at DESC").Find(&dbHistories).Error
	if err != nil {
		return nil, err
	}
	for _, v := range dbHistories {
		var fromUsers, toUsers []*model.User
		for _, fromUser := range v.FromUsers {
			fromUsers = append(fromUsers, &model.User{
				ID:       strconv.FormatUint(uint64(fromUser.ID), 10),
				Email:    fromUser.Email,
				Name:     fromUser.Name,
				ImageURL: fromUser.ImageURL,
			})
		}
		for _, toUser := range v.ToUsers {
			toUsers = append(toUsers, &model.User{
				ID:       strconv.FormatUint(uint64(toUser.ID), 10),
				Email:    toUser.Email,
				Name:     toUser.Name,
				ImageURL: toUser.ImageURL,
			})
		}

		history := &model.History{
			ID:        strconv.FormatUint(uint64(v.ID), 10),
			Title:     v.Title,
			Type:      v.Type,
			Price:     v.Price,
			FromUsers: fromUsers,
			ToUsers:   toUsers,
			CreatedAt: v.CreatedAt.Format("2006-01-02 15:04:05"),
			GroupID:   strconv.FormatUint(uint64(v.GroupID), 10),
		}
		histories = append(histories, history)
	}

	return histories, nil
}

// // Users is the resolver for the users field.
// func (r *queryResolver) Users(ctx context.Context, input model.UsersQuery) ([]*model.User, error) {
// 	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
// 	if responseAccess.Status == http.StatusInternalServerError {
// 		return nil, fmt.Errorf("サーバーエラーが発生しました")
// 	}
// 	var users []*model.User
// 	if responseAccess.Status != auth.StatusGroup {
// 		errorMessage := "認証されていません"
// 		users = append(users, &model.User{
// 			ErrorMessage: &errorMessage,
// 		})
// 		return users, nil
// 	}
// 	var dbGroup *dbModel.Group
// 	groupID, err := strconv.ParseUint(input.GroupID, 10, 64)
// 	if err != nil {
// 		return nil, err
// 	}
// 	err = r.DB.Debug().Where("id = ?", uint(groupID)).Preload("Users").Limit(1).Find(&dbGroup).Error
// 	if err != nil {
// 		return nil, err
// 	}
// 	for _, dbUser := range dbGroup.Users {
// 		users = append(users, &model.User{
// 			ID:       strconv.FormatUint(uint64(dbUser.ID), 10),
// 			Email:    dbUser.Email,
// 			Name:     dbUser.Name,
// 			ImageURL: dbUser.ImageURL,
// 		})
// 	}
// 	return users, nil
// }

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context, input model.UsersQuery) ([]*model.User, error) {
	users, err := r.Usecase.GetUsers(ctx, input)
	if err != nil {
		return nil, err
	}
	return users, nil
}

// Groups is the resolver for the groups field.
func (r *queryResolver) Groups(ctx context.Context, input model.GroupsQuery) ([]*model.Group, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	var groups []*model.Group
	if responseAccess.Status == auth.StatusUnauthorized {
		errorMessage := "認証されていません"
		groups = append(groups, &model.Group{
			ErrorMessage: &errorMessage,
		})
		return groups, nil
	}

	var dbUser *dbModel.User
	userID, err := strconv.ParseUint(input.UserID, 10, 64)
	if err != nil {
		return nil, err
	}
	err = r.DB.Debug().Where("id = ?", uint(userID)).Preload("Groups").Limit(1).Find(&dbUser).Error
	if err != nil {
		return nil, err
	}

	for _, dbGroup := range dbUser.Groups {
		// 所属しているグループのメンバーを取得する
		var myGroupUsers []*model.User
		var dbMyGroup *dbModel.Group
		err = r.DB.Debug().Where("id = ?", uint(dbGroup.ID)).Preload("Users").Limit(1).Find(&dbMyGroup).Error
		if err != nil {
			return nil, err
		}
		for _, dbMyGroupUser := range dbMyGroup.Users {
			myGroupUsers = append(myGroupUsers, &model.User{
				ID:    strconv.FormatUint(uint64(dbMyGroupUser.ID), 10),
				Email: dbMyGroupUser.Email,
				Name:  dbMyGroupUser.Name,
			})
		}

		groups = append(groups, &model.Group{
			ID:    strconv.FormatUint(uint64(dbGroup.ID), 10),
			Name:  dbGroup.Name,
			Users: myGroupUsers,
		})
	}
	return groups, nil
}

// Amounts is the resolver for the amounts field.
func (r *queryResolver) Amounts(ctx context.Context, input model.AmountsQuery) (*model.Amounts, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	if responseAccess.Status != auth.StatusGroup {
		errorMessage := "認証されていません"
		return &model.Amounts{
			ErrorMessage: &errorMessage,
		}, nil
	}

	var amounts *model.Amounts

	groupID, err := strconv.ParseUint(input.GroupID, 10, 64)
	if err != nil {
		return nil, err
	}
	userID, err := strconv.ParseUint(input.UserID, 10, 64)
	if err != nil {
		return nil, err
	}

	err = r.DB.Debug().Table("balances").Select("SUM(amount) as personal_balance").Where("group_id = ? AND user_id = ? AND date_part('year', created_at) = ? AND date_part('month', created_at) = ?", groupID, userID, input.Year, input.Month).Scan(&amounts).Error
	if err != nil {
		return nil, err
	}

	err = r.DB.Debug().Table("balances").Select("SUM(amount) as group_total").Where("group_id = ? AND date_part('year', created_at) = ? AND date_part('month', created_at) = ? AND amount > 0", groupID, input.Year, input.Month).Scan(&amounts).Error
	if err != nil {
		return nil, err
	}

	return amounts, nil
}

// Adjustment is the resolver for the adjustment field.
func (r *queryResolver) Adjustment(ctx context.Context, input model.AdjustmentQuery) ([]*model.Adjustment, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	var adjustments []*model.Adjustment
	if responseAccess.Status != auth.StatusGroup {
		errorMessage := "認証されていません"
		adjustments = append(adjustments, &model.Adjustment{
			ErrorMessage: &errorMessage,
		})
		return adjustments, nil
	}

	groupID, err := strconv.ParseUint(input.GroupID, 10, 64)
	if err != nil {
		return nil, err
	}
	var dbGroup *dbModel.Group
	err = r.DB.Debug().Where("id = ?", uint(groupID)).Preload("Users").Limit(1).Find(&dbGroup).Error
	if err != nil {
		return nil, err
	}
	type scan struct {
		PersonalBalance int
		ID              uint
		Email           string
		Name            string
	}
	var scans []*scan
	err = r.DB.Debug().Table("balances").Select("SUM(balances.amount) as personal_balance, users.id, users.email, users.name").Where("balances.group_id = ? AND date_part('year', balances.created_at) = ? AND date_part('month', balances.created_at) = ?", uint(groupID), input.Year, input.Month).Joins("LEFT JOIN users ON users.id = balances.user_id").Group("users.id").Scan(&scans).Error
	if err != nil {
		return nil, err
	}

	type personalBalanceType struct {
		PersonalBalance int
		User            *model.User
	}
	var personalBalances []*personalBalanceType
	for _, v := range scans {
		personalBalances = append(personalBalances, &personalBalanceType{
			PersonalBalance: v.PersonalBalance,
			User: &model.User{
				ID:    strconv.FormatUint(uint64(v.ID), 10),
				Email: v.Email,
				Name:  v.Name,
			},
		})
	}

	paidTooMuch := &personalBalanceType{}
	paidLess := &personalBalanceType{}
	var i int
	for true {
		sort.Slice(personalBalances, func(i, j int) bool { return personalBalances[i].PersonalBalance < personalBalances[j].PersonalBalance })
		for _, pb := range personalBalances {
			if pb.PersonalBalance > paidTooMuch.PersonalBalance {
				paidTooMuch = pb
			}
			if pb.PersonalBalance < paidLess.PersonalBalance {
				paidLess = pb
			}
		}

		if paidTooMuch.PersonalBalance == paidLess.PersonalBalance {
			break
		}
		payment := math.Min(float64(paidTooMuch.PersonalBalance), math.Abs(float64(paidLess.PersonalBalance)))
		if payment < 10 {
			break
		}
		adjustments = append(adjustments, &model.Adjustment{
			FromUser: paidLess.User,
			ToUser:   paidTooMuch.User,
			Amount:   int(payment),
		})
		paidTooMuch.PersonalBalance -= int(payment)
		paidLess.PersonalBalance += int(payment)
		i++
	}

	return adjustments, nil
}

// GroupsWhereUserHasBeenInvited is the resolver for the groupsWhereUserHasBeenInvited field.
func (r *queryResolver) GroupsWhereUserHasBeenInvited(ctx context.Context, input model.GroupsQuery) ([]*model.Group, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	var groups []*model.Group
	if responseAccess.Status == auth.StatusUnauthorized {
		errorMessage := "認証されていません"
		groups = append(groups, &model.Group{
			ErrorMessage: &errorMessage,
		})
		return groups, nil
	}

	userID, err := strconv.ParseUint(input.UserID, 10, 64)
	if err != nil {
		return nil, err
	}
	var dbInvitedUsers []dbModel.InvitedUser
	err = r.DB.Debug().Where("user_id = ?", uint(userID)).Find(&dbInvitedUsers).Error
	if err != nil {
		return nil, err
	}
	if len(dbInvitedUsers) == 0 {
		return []*model.Group{}, nil
	}
	var dbGroupIDs []uint
	for _, dbInvitedUser := range dbInvitedUsers {
		if !dbInvitedUser.Joined {
			dbGroupIDs = append(dbGroupIDs, dbInvitedUser.GroupID)
		}
	}
	var dbGroups []dbModel.Group
	err = r.DB.Where("id IN ?", dbGroupIDs).Preload("Users").Find(&dbGroups).Order("created_at DESC").Error
	if err != nil {
		return nil, err
	}
	for _, dbGroup := range dbGroups {
		var users []*model.User
		for _, dbGroupUser := range dbGroup.Users {
			users = append(users, &model.User{
				ID:    strconv.FormatUint(uint64(dbGroupUser.ID), 10),
				Email: dbGroupUser.Email,
				Name:  dbGroupUser.Name,
			})
		}
		groups = append(groups, &model.Group{
			ID:    strconv.FormatUint(uint64(dbGroup.ID), 10),
			Name:  dbGroup.Name,
			Users: users,
		})
	}

	return groups, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
