package integrations

import (
	"fmt"
	"trader/events"
	"trader/exchange"

	telegram "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
)

type Telegram struct {
	bot    *telegram.BotAPI
	chatID int64
	ex     exchange.Binance
}

var (
	PingCommand    = "ping"
	BalanceCommand = "balance"
)

func NewTelegramBot(token string, chatId int64, ex exchange.Binance) Telegram {
	log.Trace().Msg("TelegramBot.Init")

	bot, err := telegram.NewBotAPI(token)

	if err != nil {
		log.Fatal().Err(err).Msg("TelegramBot.Init")
	}

	setDefaultCommands(bot)

	return Telegram{bot, chatId, ex}
}

func (t Telegram) SendMessage(event string, msg string) {
	log.Info().Str("event", event).Msg("TelegramBot.SendMessage")

	message := telegram.NewMessage(t.chatID, msg)
	_, err := t.bot.Send(message)

	if err != nil {
		log.Error().Err(err).Msg("TelegramBot.SendMessage")
	}
}

func (t Telegram) ListenForCommands() {
	log.Trace().Msg("TelegramBot.ListenForCommands.Init")

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

		command := update.Message.Command()

		log.Info().Str("command", command).Msg("TelegramBot.ListenForCommands")

		switch command {
		case PingCommand:
			message.Text = "Pong"
		case BalanceCommand:
			acc := t.ex.GetAccount()
			message.Text = t.ex.StringifyBalance(acc.Balances)
		default:
			message.Text = "Command not defined"
		}

		// TODO: disable join all together?
		if update.Message.Chat.ID != t.chatID {
			from := update.Message.From

			log.Warn().Str("name", from.FirstName).Int("ID", int(from.ID)).Msg("Unauthorized Activity")
			message.Text = "You are not authorized, your activity has been recorded."

			notification := fmt.Sprintf("Unauthorized Activity\n\nID: %v\nName: %v", from.ID, from.FirstName)
			t.SendMessage(events.CriticalError, notification)
		}

		_, err := t.bot.Send(message)
		if err != nil {
			log.Error().Err(err).Msg("TelegramBot.ListenForCommands")
		}
	}
}

func (t Telegram) FormatTradeMessage(p events.NotifyTradePayload) string {
	message := fmt.Sprintf(
		"Executed %v Order\n\n"+
			"ID: %v\n"+
			"Type: %v\n"+
			"Symbol: %v\n"+
			"Last Price: %v\n"+
			"Quantity: %v",
		p.Side, p.ID, p.Type, p.Symbol, p.Price, p.Quantity)

	return message
}

func (t Telegram) FormatErrorMessage(p events.CriticalErrorPayload) string {
	message := fmt.Sprintf("Critical Error\n\n%v", p.Error)

	return message
}

func setDefaultCommands(bot *telegram.BotAPI) {
	log.Trace().Msg("TelegramBot.SetMyCommands")

	ping := telegram.BotCommand{PingCommand, "Ping"}
	balance := telegram.BotCommand{BalanceCommand, "Get available balance"}

	config := telegram.NewSetMyCommands(ping, balance)

	_, err := bot.Request(config)

	if err != nil {
		log.Fatal().Err(err).Msg("TelegramBot.SetCommands")
	}
}
