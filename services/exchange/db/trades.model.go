package db

import (
	"time"

	"github.com/rs/zerolog/log"
)

type Trades struct {
	ID       uint      `gorm:"primaryKey;" json:"id"`
	Symbol   string    `gorm:"not null" json:"symbol"`
	Entry    float64   `gorm:"not null" json:"entry"`
	Exit     float64   `gorm:"not null" json:"exit"`
	Quantity float64   `gorm:"not null" json:"quantity"`
	Time     time.Time `gorm:"not null" json:"time"`
}

func (db DB) GetTrades() []Trades {
	var trades []Trades

	result := db.conn.Find(&trades)

	if result.Error != nil {
		log.Error().Err(result.Error).
			Msg("DB.Trades.GetTrades")
	}

	return trades
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
