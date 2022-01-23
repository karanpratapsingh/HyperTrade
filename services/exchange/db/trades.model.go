package db

import (
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

// TODO: needs createdAt and updatedAt
type Trades struct {
	ID       uuid.UUID `gorm:"primaryKey;"`
	Symbol   string    `gorm:"not null"`
	Entry    float64   `gorm:"not null"`
	Exit     float64   `gorm:"not null"`
	Quantity float64   `gorm:"not null"`
}

func (db DB) CreateTrade(symbol string, entry, exit, quantity float64) error {
	trade := Trades{
		ID:       uuid.New(),
		Symbol:   symbol,
		Entry:    entry,
		Exit:     exit,
		Quantity: quantity,
	}

	result := db.conn.Create(&trade)

	if result.Error != nil {
		log.Error().Err(result.Error).
			Str("symbol", symbol).
			Float64("entry", entry).
			Float64("exit", exit).
			Float64("quantity", quantity).
			Msg("DB.Trades.CreateTrade")
	}

	return result.Error
}
