package db

import (
	"errors"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type Strategies struct {
	Symbol string `gorm:"primaryKey" json:"symbol"`
	Rsi    Rsi   `gorm:"not null" json:"rsi"`
}

func (db DB) GetStrategy(symbol string) Strategies {
	var strategy Strategies

	result := db.conn.First(&strategy, "symbol = ?", symbol)

	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		log.Error().Err(result.Error).Str("symbol", symbol).Msg("DB.Strategy.GetStrategy")
	}

	return strategy
}

func (db DB) CreateStrategies(strategies []Strategies) error {
	result := db.conn.Create(&strategies)

	if result.Error != nil {
		log.Error().Err(result.Error).Msg("DB.Strategy.CreateStrategies")
	}

	return result.Error
}

func (db DB) UpdateStrategy(strategy Strategies) error {
	result := db.conn.Model(&strategy).Updates(strategy)

	if result.Error != nil {
		log.Error().Err(result.Error).Msg("DB.Strategies.UpdateStrategy")
	}

	return result.Error
}
