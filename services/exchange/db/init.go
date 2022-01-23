package db

import (
	"exchange/internal"

	"github.com/rs/zerolog/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DB struct {
	conn *gorm.DB
}

func New() DB {
	env := internal.GetEnv()

	dialect := postgres.Open(env.DatabaseUrl)

	config := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	}

	db, err := gorm.Open(dialect, config)

	if err != nil {
		log.Panic().Err(err).Msg("Database.Init.Error")
	}

	err = db.AutoMigrate(&Positions{})

	if err != nil {
		log.Panic().Err(err).Msg("Database.Migrate.Error")
	}

	log.Info().Msg("Database.Init")

	return DB{db}

}
