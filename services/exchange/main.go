package main

import (
	"os"

	"exchange/db"
	"exchange/internal"

	"github.com/adshao/go-binance/v2"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func init() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
}

var interval string = "1m"

var symbol = "ETHUSDT"

func main() {
	DB := db.New()

	wait := make(chan bool)
	env := internal.GetEnv()

	pubsub := internal.NewPubSub(env.NatsUrl, env.NatsUser, env.NatsPass)
	defer pubsub.Close()

	bex := internal.NewBinance(env.BinanceApiKey, env.BinanceApiSecretKey, pubsub, env.BinanceTestnet)
	bex.PrintAccountInfo()

	go bex.Kline(symbol, interval)

	pubsub.Subscribe(internal.DataFrameEvent, func(p internal.DataFrameEventPayload) {
		ListenTrade(DB, p.Kline, p.Signal)
	})

	<-wait
}

// TODO: refactor this
func ListenTrade(DB db.DB, kline internal.Kline, signal internal.Signal) {
	side := getSide(signal)

	if side == "" {
		return
	}

	log.Trace().Str("symbol", kline.Symbol).Interface("side", side).Msg("Trade.Listen")

	position := DB.GetPosition(kline.Symbol)
	var holding bool = position.Symbol != ""

	switch side {
	case binance.SideTypeBuy:
		if !holding {
			DB.CreatePosition(kline.Symbol, kline.Close, 0.005) // TODO: get value from db
			log.Trace().Float64("price", kline.Close).Msg("Trade.Buy.Complete")
			return
		}
		log.Warn().Bool("holding", holding).Msg("Trade.Buy.Skip")

	case binance.SideTypeSell:
		if holding {
			DB.DeletePosition(kline.Symbol)
			log.Trace().Float64("price", kline.Close).Msg("Trade.Sell.Complete")
			return
		}
		log.Warn().Bool("holding", holding).Msg("Trade.Sell.Skip")
	default:
	}
}

func getSide(signal internal.Signal) binance.SideType {
	var side binance.SideType

	if signal.Buy && !signal.Sell {
		side = binance.SideTypeBuy
	} else if signal.Sell && !signal.Buy {
		side = binance.SideTypeSell
	}

	return side
}

func isEmpty(value interface{}) bool {
	return value == ""
}
