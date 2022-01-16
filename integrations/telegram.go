package integrations

import (
	"strconv"
	"trader/exchange"

	telegram "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
)

type Telegram struct {
	bot    *telegram.BotAPI
	chatID int64
	ex     exchange.Binance
}

func NewTelegramBot(token string, chatID string, ex exchange.Binance) Telegram {
	log.Debug().Msg("TelegramBot.Init")

	cid, err := strconv.ParseInt(chatID, 10, 64)

	if err != nil {
		log.Fatal().Err(err).Msg("TelegramBot.Parse.ChatID")
	}

	bot, err := telegram.NewBotAPI(token)

	if err != nil {
		log.Fatal().Err(err).Msg("TelegramBot.Init")
	}

	return Telegram{bot, cid, ex}
}

func (t Telegram) SendMessage(msg string) {
	message := telegram.NewMessage(t.chatID, msg)
	_, err := t.bot.Send(message)

	if err != nil {
		log.Error().Err(err).Msg("TelegramBot.SendMessage")
	}
}

func (t Telegram) ListenForCommands() {
	log.Info().Msg("TelegramBot.ListenForCommands")

	update := telegram.NewUpdate(0)
	update.Timeout = 60

	updates := t.bot.GetUpdatesChan(update)

	for update := range updates {
		if update.Message == nil {
			continue
		}

		if !update.Message.IsCommand() {
			continue
		}

		message := telegram.NewMessage(update.Message.Chat.ID, "")

		switch update.Message.Command() {
		case "balance":
			acc := t.ex.GetAccount()
			message.Text = t.ex.StringifyBalance(acc.Balances)
		default:
			message.Text = "Command not defined"
		}

		_, err := t.bot.Send(message)
		if err != nil {
			log.Error().Err(err).Msg("TelegramBot.ListenForCommands")
		}
	}
}
