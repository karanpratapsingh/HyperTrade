package db

import (
	"errors"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type Configs struct {
	Symbol         string  `gorm:"primaryKey" json:"symbol"`
	Base           string  `gorm:"not null" json:"base"`
	Quote          string  `gorm:"not null" json:"quote"`
	Interval       string  `gorm:"not null" json:"interval"`
	Minimum        float64 `gorm:"not null" json:"minimum"`
	AllowedAmount  float64 `gorm:"not null" json:"allowed_amount"`
	TradingEnabled bool    `gorm:"not null" json:"trading_enabled"`
}

func (db DB) GetConfigs() []Configs {
	var configs []Configs

	result := db.conn.Find(&configs)

	if result.Error != nil {
		log.Error().Err(result.Error).Msg("DB.Configs.GetConfigs")
	}

	return configs
}

func (db DB) GetConfig(symbol string) Configs {
	var config Configs

	result := db.conn.First(&config, "symbol = ?", symbol)

	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		log.Error().Err(result.Error).Str("symbol", symbol).Msg("DB.Configs.GetConfig")
	}

	return config
}

func (db DB) CreateConfig(config Configs) error {
	result := db.conn.Create(&config)

	if result.Error != nil {
		log.Error().Err(result.Error).Msg("DB.Config.CreateConfig")
	}

	return result.Error
}

func (db DB) CreateConfigs(configs []Configs) error {
	result := db.conn.Create(&configs)

	if result.Error != nil {
		log.Error().Err(result.Error).Msg("DB.Config.CreateConfigs")
	}

	return result.Error
}

func (db DB) UpdateConfigTradingEnabled(symbol string, enabled bool) error {
	config := Configs{
		Symbol: symbol,
	}

	result := db.conn.Model(&config).Update("TradingEnabled", enabled)

	if result.Error != nil {
		log.Error().Err(result.Error).Msg("DB.Config.UpdateConfigTradingEnabled")
	}

	return result.Error
}

func (db DB) UpdateConfigAllowedAmount(symbol string, amount float64) error {
	config := Configs{
		Symbol: symbol,
	}

	result := db.conn.Model(&config).Update("AllowedAmount", amount)

	if result.Error != nil {
		log.Error().Err(result.Error).Msg("DB.Config.UpdateConfigAllowedAmount")
	}

	return result.Error
}
