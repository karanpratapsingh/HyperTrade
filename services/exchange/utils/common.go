package utils

import (
	"encoding/json"
	"math"
	"strconv"

	"github.com/rs/zerolog/log"
)

func Unmarshal(data []byte, ptr interface{}) error {
	err := json.Unmarshal(data, ptr)

	if err != nil {
		log.Error().Err(err).Msg("Utils.Unmarshal")
	}

	return err
}

// Ref: https://www.binance.com/api/v3/exchangeInfo?symbol=$SYMBOL
func GetMinQuantity(min float64, price float64) float64 {
	quantity := ToFixed((1/price)*min, 5)
	return quantity
}

func Round(num float64) int {
	return int(num + math.Copysign(0.5, num))
}

func ToFixed(num float64, precision int) float64 {
	output := math.Pow(10, float64(precision))
	return float64(Round(num*output)) / output
}

func ParseFloat(str string) float64 {
	float, err := strconv.ParseFloat(str, 64)

	if err != nil {
		log.Error().Err(err).Msg("Utils.Float64")
	}

	return float
}

func ParseInt(str string) int64 {
	integer, err := strconv.ParseInt(str, 10, 64)

	if err != nil {
		log.Error().Err(err).Msg("Utils.Int64")
	}

	return integer
}
