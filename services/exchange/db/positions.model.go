package db

import (
	"errors"
	"time"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type Positions struct {
	Symbol   string    `gorm:"primaryKey"`
	Price    float64   `gorm:"not null"`
	Quantity float64   `gorm:"not null"`
	Time     time.Time `gorm:"not null"`
}

func (db DB) GetPosition(symbol string) Positions {
	var position Positions

	result := db.conn.First(&position, "symbol = ?", symbol)

	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		log.Error().Err(result.Error).Str("symbol", symbol).Msg("DB.Positions.GetPosition")
	}

	return position
}

func (db DB) CreatePosition(symbol string, price, quantity float64) error {
	position := Positions{
		Symbol:   symbol,
		Price:    price,
		Quantity: quantity,
	}

	result := db.conn.Create(&position)

	if result.Error != nil {
		log.Error().Err(result.Error).Msg("DB.Position.GetPositions")
	}

	return result.Error
}

func (db DB) DeletePosition(symbol string) {
	result := db.conn.Delete(&Positions{}, "symbol = ?", symbol)

	if result.Error != nil {
		log.Error().Err(result.Error).Str("symbol", symbol).Msg("DB.Positions.DeletePosition")
	}
}
