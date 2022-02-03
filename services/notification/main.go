package main

import (
	"notification/internal"
	"notification/utils"
	"os"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func init() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
}

func main() {
	env := utils.GetEnv()

	pubsub := internal.NewPubSub(env.NatsUrl, env.NatsUser, env.NatsPass)
	defer pubsub.Close()

	telegram := internal.NewTelegramBot(env.TelegramApiToken, env.TelegramChatId)

	pubsub.Subscribe(internal.OrderEvent, func(p internal.OrderEventPayload) {
		message := telegram.FormatOrderMessage(p)
		telegram.SendMessage(internal.OrderEvent, message)
	})

	pubsub.Subscribe(internal.TradeEvent, func(p internal.TradeEventPayload) {
		message := telegram.FormatTradeMessage(p)
		telegram.SendMessage(internal.TradeEvent, message)
	})

	pubsub.Subscribe(internal.CriticalErrorEvent, func(p internal.CriticalErrorEventPayload) {
		message := telegram.FormatErrorMessage(p)
		telegram.SendMessage(internal.CriticalErrorEvent, message)
	})

	telegram.ListenForCommands(env.Symbol)
}
