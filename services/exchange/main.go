package main

import (
	"os"

	"exchange/db"
	"exchange/internal"
	"exchange/utils"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func init() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
}

var interval string = "1m"

func main() {
	env := utils.GetEnv()
	symbol := env.Symbol

	DB := db.New(env.DatabaseUrl)
	DB.Seed(symbol)

	pubsub := internal.NewPubSub(env.NatsUrl, env.NatsUser, env.NatsPass)
	defer pubsub.Close()

	bex := internal.NewBinance(env.BinanceApiKey, env.BinanceApiSecretKey, env.BinanceTestnet, pubsub)
	bex.PrintAccountInfo(symbol)

	go bex.Kline(symbol, interval)

	internal.RunAsyncApi(DB, bex, pubsub)
}
