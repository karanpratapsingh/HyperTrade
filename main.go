package main

import (
	"os"
	"trader/events"
	"trader/exchange"
	"trader/strategy"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

var key string = os.Getenv("BINANCE_API_KEY")
var secret string = os.Getenv("BINANCE_SECRET")

// TODO: impl. DCA
// TODO: impl. RSI

var symbol = "ETHUSDT"

func init() {
	InitLogger()
}

func main() {
	forever := make(chan bool)

	bus := events.NewEventBus()

	bex := exchange.NewBinance(key, secret, bus, false)
	go bex.Kline(symbol, "1m")

	config := strategy.RsiConfig{
		Overbought: 60,
		Oversold:   40,
	}

	rsi := strategy.NewRsi("RSI_60-40", config, bus)

	bus.Subscribe(events.Kline, func(p events.KlinePayload) {
		rsi.Predict(p.Kline, p.Symbol)
	})

	<-forever
}

func InitLogger() {
	output := zerolog.ConsoleWriter{Out: os.Stderr}
	log.Logger = log.Output(output)
}
