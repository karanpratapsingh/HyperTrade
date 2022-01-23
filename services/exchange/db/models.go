package db

import "github.com/rs/zerolog/log"

// TODO: trades table to keep history?
type Positions struct {
	Symbol string  `gorm:"primaryKey"`
	Price  float64 `gorm:"not null"`
	Amount float64 `gorm:"not null"`
}

func (db DB) GetPosition(symbol string) Positions {
	var position Positions

	result := db.conn.First(&position, "symbol = ?", symbol)

	if result.Error != nil {
		log.Error().Err(result.Error).Str("symbol", symbol).Msg("DB.Positions.GetPosition")
	}

	return position
}

func (db DB) CreatePosition(symbol string, price, amount float64) {
	position := Positions{
		Symbol: symbol,
		Price:  price,
		Amount: amount,
	}

	result := db.conn.Create(&position)

	if result.Error != nil {
		log.Error().Err(result.Error).Msg("DB.Position.GetPositions")
	}
}

func (db DB) DeletePosition(symbol string) {
	result := db.conn.Delete(&Positions{}, "symbol = ?", symbol)

	if result.Error != nil {
		log.Error().Err(result.Error).Str("symbol", symbol).Msg("DB.Positions.DeletePosition")
	}
}
