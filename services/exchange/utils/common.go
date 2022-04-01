package utils

import (
	"encoding/json"
	"fmt"
	"math"
	"strconv"

	"github.com/rs/zerolog/log"
)

func Unmarshal(data []byte, ptr any) error {
	err := json.Unmarshal(data, ptr)

	if err != nil {
		log.Error().Err(err).Msg("Utils.Unmarshal")
	}

	return err
}

// Ref: https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
func ParseOrderQuantity(quantity float64) string {
	return fmt.Sprintf("%.8f", quantity)[0:6]
}

// Ref: https://www.binance.com/api/v3/exchangeInfo?symbol=$SYMBOL
func GetMinQuantity(min float64, price float64) float64 {
	quantity := (1 / price) * min
	return quantity
}

func ToFixed(num float64, precision int) float64 {
	output := math.Pow(10, float64(precision))
	return float64(int(num*output)) / output
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
