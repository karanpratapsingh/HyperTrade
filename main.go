package main

import (
	"os"
	"trader/events"
	"trader/exchange"
	"trader/strategy"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// TODO: impl. DCA

var key string = os.Getenv("BINANCE_API_KEY")
var secret string = os.Getenv("BINANCE_SECRET_KEY")
var natsURL string = os.Getenv("NATS_URL")

func init() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
}

var interval string = "1m"

var symbols = []string{
	"BTCUSDT",
	"ETHUSDT",
}

func main() {
	wait := make(chan os.Signal, 1)

	pubsub := events.NewPubSub(natsURL)
	defer pubsub.Close()

	bex := exchange.NewBinance(key, secret, pubsub, false)
	bex.PrintUserInfo()

	for _, symbol := range symbols {
		go bex.Kline(symbol, interval)
	}

	config := strategy.RsiConfig{
		Overbought: 60,
		Oversold:   40,
	}

	rsi := strategy.NewRsi("RSI_60-40", config, pubsub, symbols)

	pubsub.Subscribe(events.Kline, func(p events.KlinePayload) {
		rsi.Predict(p.Kline, p.Symbol)
	})

	pubsub.Subscribe(events.SignalBuy, func(p events.SignalBuyPayload) {
		bex.Buy(p.Symbol)
	})

	pubsub.Subscribe(events.SignalSell, func(p events.SignalSellPayload) {
		bex.Sell(p.Symbol)
	})

	<-wait
}
