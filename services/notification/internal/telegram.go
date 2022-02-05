package internal

import (
	"fmt"
	"strings"
	"time"

	telegram "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
)

type Telegram struct {
	bot    *telegram.BotAPI
	chatID int64
	pubsub PubSub
}

var (
	PingCommand    = "ping"
	BalanceCommand = "balance"
	StatsCommand   = "stats"
)

func NewTelegramBot(token string, chatId int64, pubsub PubSub) Telegram {
	log.Trace().Msg("TelegramBot.Init")

	bot, err := telegram.NewBotAPI(token)

	if err != nil {
		log.Fatal().Err(err).Msg("TelegramBot.Init")
	}

	t := Telegram{bot, chatId, pubsub}
	t.SetDefaultCommands()

	return t
}

func (t Telegram) SetDefaultCommands() {
	log.Trace().Msg("TelegramBot.SetMyCommands")

	ping := telegram.BotCommand{PingCommand, "Ping"}
	balance := telegram.BotCommand{BalanceCommand, "Get available balance"}
	stats := telegram.BotCommand{StatsCommand, "Get trade statistics"}

	config := telegram.NewSetMyCommands(ping, balance, stats)

	_, err := t.bot.Request(config)

	if err != nil {
		log.Fatal().Err(err).Msg("TelegramBot.SetCommands")
	}
}

func (t Telegram) ListenForCommands(symbol string) {
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
			var r BalanceResponse
			err := t.pubsub.Request(GetBalanceEvent, nil, &r)

			if err != nil {
				message.Text = err.Error()
			} else {
				message.Text = t.FormatBalanceMessage(r)
			}
		case StatsCommand:
			var r StatsResponse

			req := StatsRequest{symbol}
			err := t.pubsub.Request(GetStatsEvent, req, &r)

			if err != nil {
				message.Text = err.Error()
			} else {
				message.Text = t.FormatStatsMessage(r)
			}
		default:
			message.Text = "Command not defined"
		}

		if update.Message.Chat.ID != t.chatID {
			from := update.Message.From

			log.Warn().Str("name", from.FirstName).Int("ID", int(from.ID)).Msg("Unauthorized Activity")
			message.Text = "You are not authorized, your activity has been recorded."

			notification := fmt.Sprintf("Unauthorized Activity\n\nID: %v\nName: %v", from.ID, from.FirstName)
			t.SendMessage(CriticalErrorEvent, notification)
		}

		_, err := t.bot.Send(message)
		if err != nil {
			log.Error().Err(err).Msg("TelegramBot.ListenForCommands")
		}
	}
}

func (t Telegram) SendMessage(event string, msg string) {
	log.Info().Str("event", event).Msg("TelegramBot.SendMessage")

	message := telegram.NewMessage(t.chatID, msg)
	_, err := t.bot.Send(message)

	if err != nil {
		log.Error().Err(err).Msg("TelegramBot.SendMessage")
	}
}

func (t Telegram) FormatOrderMessage(p OrderEventPayload) string {
	message := fmt.Sprintf(
		"Created %v Order:\n\n"+
			"ID: %v\n"+
			"Type: %v\n"+
			"Symbol: %v\n"+
			"Last Price: %v\n"+
			"Quantity: %v",
		p.Side, p.ID, p.Type, p.Symbol, p.Price, p.Quantity)

	return message
}

func (t Telegram) FormatTradeMessage(p TradeEventPayload) string {
	time := p.Time.Format(time.RFC822)

	message := fmt.Sprintf(
		"Executed Trade:\n\n"+
			"ID: %v\n"+
			"Symbol: %v\n"+
			"Entry: %v\n"+
			"Exit: %v\n"+
			"Quantity: %v\n"+
			"Time: %v",
		p.ID, p.Symbol, p.Entry, p.Exit, p.Quantity, time)

	return message
}

func (t Telegram) FormatBalanceMessage(r BalanceResponse) string {
	header := "Balance:\n"

	if r.Test {
		header = fmt.Sprintln("Test", header)
	}

	var balances = []string{header}
	var separator rune = '•'

	for _, balance := range r.Balance {
		b := fmt.Sprintf("%c %v %v", separator, balance.Asset, balance.Amount)
		balances = append(balances, b)
	}

	return strings.Join(balances, "\n")
}

func (t Telegram) FormatStatsMessage(r StatsResponse) string {
	var message string

	if r.Stats == nil {
		message = "Stats:\n\nNo data available yet"
	} else {
		message = fmt.Sprintf("Stats:\n\nProfit: %.4f\nLoss: %.4f", r.Stats.Profit, r.Stats.Loss)
	}

	return message
}

func (t Telegram) FormatErrorMessage(p CriticalErrorEventPayload) string {
	message := fmt.Sprintf("Critical Error\n\n%v", p.Error)

	return message
}
