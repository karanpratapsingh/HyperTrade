package main

import (
	"fmt"
	"os"
	"trader/env"
	"trader/events"
	"trader/exchange"
	"trader/integrations"
	"trader/strategy"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// TODO: impl. DCA

func init() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
}

var interval string = "1m"

var symbols = []string{
	"BTCUSDT",
	"ETHUSDT",
}

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

	pubsub.Subscribe(events.SignalBuy, func(p events.SignalBuyPayload) {
		bex.Buy(p.Symbol)
	})

	pubsub.Subscribe(events.SignalSell, func(p events.SignalSellPayload) {
		bex.Sell(p.Symbol)
	})

	pubsub.Subscribe(events.NotifyTrade, func(p events.NotifyTradePayload) {
		message := fmt.Sprintf("Executed Order\n\nID: %v\nType: %v\nSymbol: %v\nClose Price: %v\nAmount: %v", p.ID, p.Type, p.Symbol, p.Price, p.Amount)
		telegram.SendMessage(events.NotifyTrade, message)
	})

	telegram.ListenForCommands()
}
