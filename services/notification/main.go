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

	telegram := internal.NewTelegramBot(env.TelegramApiToken, env.TelegramChatId, pubsub)

	internal.RunAsyncApi(telegram, pubsub)
	telegram.ListenForCommands()
}
