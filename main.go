package main

import (
	"os"
	"trader/exchange"
	"trader/strategy"
	"trader/tasks"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// TODO: impl. DCA

var key string = os.Getenv("BINANCE_API_KEY")
var secret string = os.Getenv("BINANCE_SECRET")
var redisAddr string = os.Getenv("REDIS_ADDR")

func init() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
}

var interval string = "1m"

var symbols = []string{
	"BTCUSDT",
	"ETHUSDT",
}

func main() {
	t := tasks.NewTasks(redisAddr)
	defer t.Close()

	bex := exchange.NewBinance(key, secret, t, false)

	for _, symbol := range symbols {
		go bex.Kline(symbol, interval)
	}

	config := strategy.RsiConfig{
		Overbought: 60,
		Oversold:   40,
	}

	rsi := strategy.NewRsi("RSI_60-40", config, t)

	handlers := tasks.NewHandlers(redisAddr)

	handlers.SubscribeKline(func(p tasks.KlinePayload) error {
		rsi.Predict(p.Kline, p.Symbol)
		return nil
	})

	handlers.SubscribeSignalBuy(func(p tasks.SignalBuyPayload) error {
		return bex.Buy(p.Symbol)
	})

	handlers.SubscribeSignalSell(func(p tasks.SignalSellPayload) error {
		return bex.Sell(p.Symbol)
	})

	// TODO: graceful shutdown
	handlers.Run()
}
