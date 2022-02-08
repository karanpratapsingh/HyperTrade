package internal

import (
	"fmt"

	telegram "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
)

type Telegram struct {
	bot    *telegram.BotAPI
	chatID int64
	pubsub PubSub
}

var (
	ConfigsCommand        = "configs"
	BalanceCommand        = "balance"
	PositionsCommand      = "positions"
	StatsCommand          = "stats"
	EnableTradingCommand  = "enable"
	DisableTradingCommand = "disable"
	DumpCommand           = "dump"
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

	configs := telegram.BotCommand{ConfigsCommand, "Get configs"}
	balance := telegram.BotCommand{BalanceCommand, "Get balance"}
	positions := telegram.BotCommand{PositionsCommand, "Get positions"}
	stats := telegram.BotCommand{StatsCommand, "Get statistics"}
	enableTrading := telegram.BotCommand{EnableTradingCommand, "Enable trading"}
	disableTrading := telegram.BotCommand{DisableTradingCommand, "Disable trading"}
	dump := telegram.BotCommand{DumpCommand, "Dump asset"}

	config := telegram.NewSetMyCommands(configs, balance, positions, stats, enableTrading, disableTrading, dump)

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
		message.ParseMode = telegram.ModeMarkdownV2

		command := update.Message.Command()

		log.Info().Str("command", command).Msg("TelegramBot.ListenForCommands")

		switch command {
		case ConfigsCommand:
			var r ConfigsResponse

			err := t.pubsub.Request(GetConfigsEvent, nil, &r)

			if err != nil {
				message.Text = err.Error()
			} else {
				message.Text = t.FormatConfigsMessage(r)
			}
		case BalanceCommand:
			var r BalanceResponse

			err := t.pubsub.Request(GetBalanceEvent, nil, &r)

			if err != nil {
				message.Text = err.Error()
			} else {
				message.Text = t.FormatBalanceMessage(r)
			}
		case PositionsCommand:
			var r PositionsResponse

			err := t.pubsub.Request(GetPositionsEvent, nil, &r)

			if err != nil {
				message.Text = err.Error()
			} else {
				message.Text = t.FormatPostionsMessage(r)
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
		case EnableTradingCommand:
			message.Text = t.FormatUpdateTradingMessage(symbol, true)
		case DisableTradingCommand:
			message.Text = t.FormatUpdateTradingMessage(symbol, false)
		case DumpCommand:
			var r DumpResponse

			req := DumpRequest{symbol}
			err := t.pubsub.Request(DumpEvent, req, &r)

			if err != nil {
				message.Text = err.Error()
			} else {
				message.Text = t.FormatDumpMessage(symbol, r)
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
	message.ParseMode = telegram.ModeMarkdownV2

	_, err := t.bot.Send(message)

	if err != nil {
		log.Error().Err(err).Msg("TelegramBot.SendMessage")
	}
}
