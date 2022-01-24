package db

import (
	"time"

	"github.com/rs/zerolog/log"
)

type Trades struct {
	ID       uint      `gorm:"primaryKey;"`
	Symbol   string    `gorm:"not null"`
	Entry    float64   `gorm:"not null"`
	Exit     float64   `gorm:"not null"`
	Quantity float64   `gorm:"not null"`
	Time     time.Time `gorm:"not null"`
}

func (db DB) CreateTrade(symbol string, entry, exit, quantity float64) Trades {
	trade := Trades{
		Symbol:   symbol,
		Entry:    entry,
		Exit:     exit,
		Quantity: quantity,
		Time:     time.Now(),
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

	return trade
}
