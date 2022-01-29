package db

import (
	"exchange/utils"

	"github.com/rs/zerolog/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DB struct {
	conn *gorm.DB
}

func New() DB {
	env := utils.GetEnv()

	log.Trace().Msg("Database.Init")

	dialect := postgres.Open(env.DatabaseUrl)

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

	db := DB{conn}

	Seed(db)

	return db

}
