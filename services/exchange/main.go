package main

import (
	"fmt"
	"os"

	"exchange/internal"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func init() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
}

var interval string = "1m"

var symbol = "ETHUSDT"

func main() {
	wait := make(chan bool)
	env := internal.GetEnv()

	pubsub := internal.NewPubSub(env.NatsUrl, env.NatsUser, env.NatsPass)
	defer pubsub.Close()

	bex := internal.NewBinance(env.BinanceApiKey, env.BinanceApiSecretKey, pubsub, env.BinanceTestnet)
	bex.PrintAccountInfo()

	go bex.Kline(symbol, interval)

	pubsub.Subscribe(internal.DataFrameEvent, func(p internal.DataFrameEventPayload) {
		fmt.Println(p.Trade)
	})

	<-wait
}
