package db

import (
	"errors"
	"exchange/utils"
	"os"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type seedConfig struct {
	Configs []Configs `json:"configs"`
}

type seed struct {
	Name string
	Type interface{}
	Fn   func() error
}

var path = "seed.json"

func (db DB) Seed() {
	migrater := db.conn.Migrator()

	file, err := os.ReadFile(path)

	if err != nil {
		log.Panic().Str("path", path).Msg("Database.Seed.ReadFile")
	}

	var sc seedConfig
	utils.Unmarshal(file, &sc)

	var seeds = []seed{
		{
			Name: "create configs",
			Type: &Configs{},
			Fn: func() error {
				return db.CreateConfigs(sc.Configs)
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
