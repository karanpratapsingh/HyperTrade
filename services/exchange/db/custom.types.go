package db

import (
	"database/sql/driver"
	"encoding/json"
)

type CommonStrategyProps struct {
	Enabled bool `json:"enabled"`
}

type Rsi struct {
	CommonStrategyProps
	Period     int `json:"period"`
	Overbought int `json:"overbought"`
	Oversold   int `json:"oversold"`
}

func (Rsi) GormDataType() string {
	return "JSONB"
}

func (r *Rsi) Scan(value any) error {
	return json.Unmarshal(value.([]byte), &r)
}

func (r Rsi) Value() (driver.Value, error) {
	return json.Marshal(r)
}

type Macd struct {
	CommonStrategyProps
	Fast   int `json:"fast"`
	Slow   int `json:"slow"`
	Signal int `json:"signal"`
}

func (Macd) GormDataType() string {
	return "JSONB"
}

func (r *Macd) Scan(value any) error {
	return json.Unmarshal(value.([]byte), &r)
}

func (r Macd) Value() (driver.Value, error) {
	return json.Marshal(r)
}
