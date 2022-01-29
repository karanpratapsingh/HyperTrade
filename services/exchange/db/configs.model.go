package db

import (
	"errors"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type Configs struct {
	Symbol        string  `gorm:"primaryKey" json:"symbol"`
	Minimum       float64 `gorm:"not null" json:"minimum"`
	AllowedAmount float64 `gorm:"not null" json:"allowedAmount"`
}

func (db DB) GetConfig(symbol string) Configs {
	var config Configs

	result := db.conn.First(&config, "symbol = ?", symbol)

	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		log.Error().Err(result.Error).Str("symbol", symbol).Msg("DB.Positions.GetPosition")
	}

	return config
}

func (db DB) CreateConfig(symbol string, minimum, allowedAmt float64) error {
	config := Configs{
		Symbol:        symbol,
		Minimum:       minimum,
		AllowedAmount: allowedAmt,
	}

	result := db.conn.Create(&config)

	if result.Error != nil {
		log.Error().Err(result.Error).Msg("DB.Config.CreateConfig")
	}

	return result.Error
}
