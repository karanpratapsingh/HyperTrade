package db

import (
	"errors"
	"fmt"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type seed struct {
	Name string
	Type interface{}
	Fn   func() error
}

func (db DB) Seed(symbol string) {
	migrater := db.conn.Migrator()

	var seeds = []seed{
		{
			Name: fmt.Sprintf("create config for %v", symbol),
			Type: &Configs{},
			Fn: func() error {
				return db.CreateConfig(symbol, 12, 12)
			},
		},
	}

	for _, seed := range seeds {
		if migrater.HasTable(seed.Type) {
			// Only seed if the table is empty
			if err := db.conn.First(seed.Type).Error; errors.Is(err, gorm.ErrRecordNotFound) {
				log.Debug().Str("name", seed.Name).Msg("Database.Seed")
				if err := seed.Fn(); err != nil {
					log.Panic().Str("name", seed.Name).Msg("Database.Seed")
				}
			}
		}
	}
}
