package db

import (
	"errors"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type seed struct {
	Name string
	Type interface{}
	Fn   func() error
}

func Seed(db DB) {
	migrater := db.conn.Migrator()

	var seeds = []seed{
		{
			Name: "create config for ETHUSDT",
			Type: &Configs{},
			Fn: func() error {
				return db.CreateConfig("ETHUSDT", 10)
			},
		},
	}

	for _, seed := range seeds {
		if migrater.HasTable(seed.Type) {
			// Only seed if table is empty
			if err := db.conn.First(seed.Type).Error; errors.Is(err, gorm.ErrRecordNotFound) {
				log.Debug().Str("name", seed.Name).Msg("Database.Seed")
				if err := seed.Fn(); err != nil {
					log.Panic().Str("name", seed.Name).Msg("Database.Seed")
				}
			}
		}
	}
}
