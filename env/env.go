package env

import "github.com/kelseyhightower/envconfig"

type Env struct {
	BinanceApiKey       string `envconfig:"BINANCE_API_KEY"`
	BinanceApiSecretKey string `envconfig:"BINANCE_SECRET_KEY"`

	NatsUrl  string `envconfig:"NATS_URL"`
	NatsUser string `envconfig:"NATS_USER"`
	NatsPass string `envconfig:"NATS_PASS"`

	TelegramApiToken string `envconfig:"TELEGRAM_API_TOKEN"`
	TelegramChatId   int64  `envconfig:"TELEGRAM_CHAT_ID"`
}

func Get() Env {
	var env Env
	envconfig.MustProcess("", &env)
	return env
}
