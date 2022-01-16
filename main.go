package main

import (
	"fmt"
	"os"
	"trader/events"
	"trader/exchange"
	"trader/integrations"
	"trader/strategy"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// TODO: impl. DCA

var key = os.Getenv("BINANCE_API_KEY")
var secret = os.Getenv("BINANCE_SECRET_KEY")
var natsURL = os.Getenv("NATS_URL")
var telegramApiToken = os.Getenv("TELEGRAM_API_TOKEN")
var telegramChatID = os.Getenv("TELEGRAM_CHAT_ID")

func init() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
}

var interval string = "1m"

var symbols = []string{
	"BTCUSDT",
	"ETHUSDT",
}

func main() {
	pubsub := events.NewPubSub(natsURL)
	defer pubsub.Close()

	telegram := integrations.NewTelegramBot(telegramApiToken, telegramChatID)

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

	pubsub.Subscribe(events.NotifyTrade, func(p events.NotifyTradePayload) {
		message := fmt.Sprintf("Executed %v\nToken: %v\nAmount: %v", p.Type, p.Symbol, p.Amount)
		telegram.SendMessage(message)
	})

	telegram.ListenForCommands()
}
