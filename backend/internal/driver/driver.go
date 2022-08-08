package driver

import (
	"database/sql"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectSQL(dsn string) (*gorm.DB, error) {
	db, err := NewDatabase(dsn)
	if err != nil {
		panic(err)
	}

	return db, nil
	
}

// NewDatabase creates a new database for the application
func NewDatabase(dsn string) (*gorm.DB, error) {
	sqlDB, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, err
	}
	if err = sqlDB.Ping(); err != nil {
		return nil, err
	}
	db, err := gorm.Open(postgres.New(postgres.Config{
		Conn: sqlDB,
	}), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return db, nil
}