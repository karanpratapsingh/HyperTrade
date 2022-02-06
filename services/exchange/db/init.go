package db

import (
	"github.com/rs/zerolog/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DB struct {
	conn *gorm.DB
}

func New(dbURL string) DB {
	log.Trace().Msg("Database.Init")

	dialect := postgres.Open(dbURL)

	config := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	}

	conn, err := gorm.Open(dialect, config)

	if err != nil {
		log.Panic().Err(err).Msg("Database.Init.Error")
	}

	err = conn.AutoMigrate(
		&Configs{},
		&Positions{},
		&Trades{},
	)

	if err != nil {
		log.Panic().Err(err).Msg("Database.Migrate.Error")
	}

	return DB{conn}
}
