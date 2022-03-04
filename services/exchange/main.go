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

func main() {
	wait := make(chan bool)

	env := utils.GetEnv()

	DB := db.New(env.DatabaseUrl)
	DB.Seed()

	pubsub := internal.NewPubSub(env.NatsUrl, env.NatsUser, env.NatsPass)
	defer pubsub.Close()

	bex := internal.NewBinance(
		env.BinanceApiKey,
		env.BinanceApiSecretKey,
		env.BinanceTestnet,
		pubsub,
		DB,
	)

	go bex.Kline()

	internal.RunAsyncApi(DB, bex, pubsub)

	<-wait
}
