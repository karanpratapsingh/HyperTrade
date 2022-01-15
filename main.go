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
var secret string = os.Getenv("BINANCE_SECRET")

var interval string = "1m"

var symbols = []string{
	"BTCUSDT",
	"ETHUSDT",
}

func init() {
	InitLogger()
}

func main() {
	forever := make(chan bool)

	bus := events.NewEventBus()
	bex := exchange.NewBinance(key, secret, bus, false)

	config := strategy.RsiConfig{
		Overbought: 60,
		Oversold:   40,
	}

	rsi := strategy.NewRsi("RSI_60-40", config, bus)

	for _, symbol := range symbols {
		go bex.Kline(symbol, interval)
	}

	bus.Subscribe(events.Kline, func(p events.KlinePayload) {
		rsi.Predict(p.Kline, p.Symbol)
	})

	bus.Subscribe(events.SignalBuy, func(p events.SignalBuyPayload) {
		log.Info().Str("symbol", p.Symbol).Msg(events.SignalBuy)
		// TODO: send notification
		bex.Buy(p.Symbol)
	})

	bus.Subscribe(events.SignalSell, func(p events.SignalSellPayload) {
		log.Info().Str("symbol", p.Symbol).Msg(events.SignalSell)
		// TODO: send notification
		bex.Sell(p.Symbol)
	})

	<-forever
}

func InitLogger() {
	output := zerolog.ConsoleWriter{Out: os.Stderr}
	log.Logger = log.Output(output)
}
