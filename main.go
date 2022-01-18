package main

import (
	"os"
	"trader/env"
	"trader/events"
	"trader/exchange"
	"trader/integrations"
	"trader/strategy"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

/* TODO:
 *	implement more strategies. i.e. SMA, DSMA etc.
 *  implement DCA
 *  new coin listing subscribe
 */

func init() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
}

var interval string = "1m"

var symbols = []string{"ETHUSDT"}

func main() {
	env := env.Get()

	pubsub := events.NewPubSub(env.NatsUrl, env.NatsUser, env.NatsPass)
	defer pubsub.Close()

	bex := exchange.NewBinance(env.BinanceApiKey, env.BinanceApiSecretKey, pubsub, env.BinanceTestnet)
	bex.PrintAccountInfo()

	telegram := integrations.NewTelegramBot(env.TelegramApiToken, env.TelegramChatId, bex)

	for _, symbol := range symbols {
		go bex.Kline(symbol, interval)
	}

	config := strategy.RsiConfig{
		Overbought: 60,
		Oversold:   40,
	}

	rsi := strategy.NewRsi("Rsi_60-40", config, pubsub, symbols)

	pubsub.Subscribe(events.Kline, func(p events.KlinePayload) {
		rsi.Predict(p.Kline, p.Symbol)
	})

	pubsub.Subscribe(events.SignalTrade, func(p events.SignalTradePayload) {
		bex.Trade(p.Side, p.Symbol, p.Price)
	})


	pubsub.Subscribe(events.NotifyTrade, func(p events.NotifyTradePayload) {
		message := telegram.FormatTradeMessage(p)
		telegram.SendMessage(events.NotifyTrade, message)
	})

	telegram.ListenForCommands()
}
