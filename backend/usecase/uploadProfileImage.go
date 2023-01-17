package usecase

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/sijysn/resistar/backend/graph/model"
	"github.com/sijysn/resistar/backend/internal/auth"
	"github.com/sijysn/resistar/backend/internal/middleware"
	"github.com/sijysn/resistar/backend/internal/session"
	"github.com/sijysn/resistar/backend/repository"
	"github.com/sijysn/resistar/backend/utility"
)

func(u *UsecaseRepository) UploadProfileImage(ctx context.Context, input model.UploadInput) (*model.UploadPayload, error) {
	responseAccess := ctx.Value(middleware.ResponseAccessKey).(*middleware.ResponseAccess)
	if responseAccess.Status == http.StatusInternalServerError {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	if responseAccess.Status == auth.StatusUnauthorized {
		return &model.UploadPayload{
			Path: "",
		}, nil
	}

	// todo: Read後もbyteが変わらないようにバリデーションする
	// head := make([]byte, 512)
	// n, err := input.Data.File.Read(head)
	// if err != nil && !errors.Is(err, io.EOF) {
	// 	return nil, err
	// }
	// contentType := http.DetectContentType(head[:n])
	// if contentType != "image/jpeg" && contentType != "image/png" {
	// 	return nil, fmt.Errorf("この拡張子はアップロードできません")
	// }

	cloudinaryCloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	if cloudinaryCloudName == "" {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	cloudinaryAPIKey:= os.Getenv("CLOUDINARY_API_KEY")
	if cloudinaryAPIKey == "" {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	cloudinaryAPISecret := os.Getenv("CLOUDINARY_API_SECRET")
	if cloudinaryAPISecret == "" {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	env:= os.Getenv("ENV")
	if env == "" {
		return nil, fmt.Errorf("サーバーエラーが発生しました")
	}
	userID := utility.ParseUintToString(*session.Session.UserID)
	publicID := env + "/" + userID + "/" + input.Data.Filename;
	cld, err := cloudinary.NewFromParams(cloudinaryCloudName, cloudinaryAPIKey, cloudinaryAPISecret)
	if err != nil {
		return nil, err
	}
	result, err := cld.Upload.Upload(ctx, input.Data.File, uploader.UploadParams{PublicID: publicID});
	if err != nil {
		return nil, err
	}

	dbUserID, err := utility.ParseStringToUint(userID)
	if err != nil {
		return nil, err
	}
	updateUserInput := repository.UpdateUserInput {
		UserID: dbUserID,
		ImageURL: result.SecureURL,
	}
	user, err := u.Repository.UpdateUser(updateUserInput)
	if err != nil {
		return nil, err
	}
	// todo: ID返すようにする
	return &model.UploadPayload{
		Path: user.ImageURL,
	}, nil
}