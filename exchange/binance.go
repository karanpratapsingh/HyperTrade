package exchange

import (
	"context"
	"fmt"
	"strconv"
	"trader/events"

	"trader/types"

	"github.com/adshao/go-binance/v2"
	"github.com/rs/zerolog/log"
)

type Binance struct {
	client *binance.Client
	pubsub events.PubSub
	test   bool
}

func NewBinance(key, secret string, pubsub events.PubSub, test bool) Binance {
	log.Debug().Str("type", "binance").Bool("test", test).Msg("Init Exchange")

	binance.UseTestnet = test
	client := binance.NewClient(key, secret)

	return Binance{client, pubsub, test}
}

func (b Binance) PrintUserInfo() {
	svc := b.client.NewGetAccountService()
	user, err := svc.Do(context.Background())

	if err != nil {
		log.Error().Err(err).Msg("UserInfo")
	}

	fmt.Println("---- User Info ----")
	fmt.Println("Account Type:", user.AccountType)
	fmt.Println("Can Trade:", user.CanTrade)
	fmt.Println("Available Balance")

	for _, balance := range user.Balances {
		amt, err := strconv.ParseFloat(balance.Free, 64)

		if err != nil {
			log.Error().Err(err).Msg("Parsing balance")
		}

		if amt > 0.00000000 {
			fmt.Println(" -", balance.Asset, balance.Free)
		}
	}

	fmt.Println("-------------------")
}

func (Binance) Buy(symbol string) error {
	// TODO: get live quantity data for $1
	log.Info().Str("symbol", symbol).Msg(events.SignalBuy)
	return nil
}

func (Binance) Sell(symbol string) error {
	log.Info().Str("symbol", symbol).Msg(events.SignalSell)
	return nil
}

func (b Binance) Kline(symbol string, interval string) {
	wsKlineHandler := func(event *binance.WsKlineEvent) {
		close := event.Kline.IsFinal
		price, err := strconv.ParseFloat(event.Kline.Close, 64)

		kline := types.Kline{price, close}

		if err != nil {
			log.Error().Err(err).Msg("Parse err")
		}

		b.pubsub.Publish(events.Kline, events.KlinePayload{kline, symbol})
	}

	errHandler := func(err error) {
		log.Error().Err(err).Msg("Kline Error")
	}

	binance.WsKlineServe(symbol, interval, wsKlineHandler, errHandler)
}
