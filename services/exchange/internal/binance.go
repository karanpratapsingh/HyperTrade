package internal

import (
	"context"
	"errors"
	"exchange/db"
	"exchange/utils"
	"time"

	"github.com/adshao/go-binance/v2"
	"github.com/rs/zerolog/log"
)

var ZeroBalance = 0.00000000

type Binance struct {
	client *binance.Client
	test   bool
	pubsub PubSub
	DB     db.DB
}

var ErrBaseAsset = errors.New("base asset for symbol not found")

func NewBinance(key, secret string, test bool, pubsub PubSub, DB db.DB) Binance {
	log.Trace().Str("type", "binance").Bool("test", test).Msg("Binance.Init")

	binance.UseTestnet = test
	client := binance.NewClient(key, secret)

	return Binance{client, test, pubsub, DB}
}

func (b Binance) GetAccount() *binance.Account {
	svc := b.client.NewGetAccountService()
	account, err := svc.Do(context.Background())

	if err != nil {
		log.Error().Err(err).Msg("Binance.UserInfo")
	}

	return account
}

func (b Binance) GetBalance() []Balance {
	acc := b.GetAccount()
	balances := []Balance{}

	for _, balance := range acc.Balances {
		asset := balance.Asset
		amt := utils.ParseFloat(balance.Free)

		if amt > ZeroBalance {
			b := Balance{asset, amt}
			balances = append(balances, b)
		}
	}

	return balances
}

func (b Binance) GetBalanceQuantity(symbol string) (float64, error) {
	info, err := b.client.NewExchangeInfoService().Symbol(symbol).Do(context.Background())

	if err != nil {
		log.Error().Str("symbol", symbol).Err(err).Msg("Binance.GetBalanceQuantity")
		return 0, err
	}

	balances := b.GetBalance()

	asset := info.Symbols[0].BaseAsset

	for _, balance := range balances {
		if balance.Asset == asset {
			return balance.Amount, nil
		}
	}

	log.Error().Str("symbol", symbol).Err(ErrBaseAsset).Msg("Binance.GetBalanceQuantity")
	b.pubsub.Publish(CriticalErrorEvent, CriticalErrorEventPayload{ErrBaseAsset.Error()})

	return 0, ErrBaseAsset
}

func (b Binance) Dump(symbol string) (dump DumpResponse, err error) {
	log.Info().Str("symbol", symbol).Msg("Binance.Dump")

	quantity, err := b.GetBalanceQuantity(symbol)

	if err != nil {
		log.Error().Err(err).Msg("Binance.Dump.Skip")
		return dump, err
	}

	orderQuantity := utils.ParseOrderQuantity(quantity)

	order, err := b.client.NewCreateOrderService().
		Symbol(symbol).
		Side(binance.SideTypeSell).
		Type(binance.OrderTypeMarket).
		Quantity(orderQuantity).
		Do(context.Background())

	if err != nil {
		log.Error().Str("quantity", orderQuantity).Err(err).Msg("Binance.Dump.Error")
		b.pubsub.Publish(CriticalErrorEvent, CriticalErrorEventPayload{err.Error()})
		return dump, err
	}

	dump.ID = order.OrderID
	dump.Quantity = utils.ParseFloat(orderQuantity)

	return dump, nil
}

func (b Binance) Trade(side binance.SideType, symbol string, price, quantity float64) error {
	log.Info().Interface("side", side).Str("symbol", symbol).Float64("quantity", quantity).Msg("Binance.Trade.Init")

	orderQuantity := utils.ParseOrderQuantity(quantity)

	order, err := b.client.NewCreateOrderService().
		Symbol(symbol).
		Side(side).
		Type(binance.OrderTypeMarket).
		Quantity(orderQuantity).
		Do(context.Background())

	finalQuantity := utils.ParseFloat(orderQuantity)

	if err != nil {
		log.Error().Interface("side", side).Float64("price", price).Float64("quantity", finalQuantity).Err(err).Msg("Binance.Trade")
		b.pubsub.Publish(CriticalErrorEvent, CriticalErrorEventPayload{err.Error()})
		return err
	}

	log.Info().Interface("side", side).Float64("price", price).Float64("quantity", finalQuantity).Msg("Binance.Trade.Order")

	payload := OrderEventPayload{order.OrderID, order.Side, order.Type, symbol, price, finalQuantity}
	b.pubsub.Publish(OrderEvent, payload)

	return nil
}

func (b Binance) Kline() {
	klineHandler := func(event *binance.WsKlineEvent) {
		symbol := event.Kline.Symbol
		time := time.Now().Unix() * 1000
		open := utils.ParseFloat(event.Kline.Open)
		high := utils.ParseFloat(event.Kline.High)
		low := utils.ParseFloat(event.Kline.Low)
		close := utils.ParseFloat(event.Kline.Close)
		volume := utils.ParseFloat(event.Kline.Volume)
		final := event.Kline.IsFinal

		kline := Kline{symbol, time, open, high, low, close, volume, final}

		log.Info().
			Str("symbol", symbol).
			Float64("open", open).
			Float64("high", high).
			Float64("low", low).
			Float64("close", close).
			Float64("volume", volume).
			Bool("final", final).
			Msg(KlineEvent)

		strategy := b.DB.GetStrategy(symbol)
		b.pubsub.Publish(KlineEvent, KlinePayload{kline, strategy})
	}

	errHandler := func(err error) {
		log.Error().Err(err).Msg("Binance.Kline.Error")

		// Try to restart ws connection
		log.Warn().Msg("Binance.Kline.Recover")
		b.Kline()
	}

	configs := b.DB.GetConfigs()

	for _, config := range configs {
		log.Info().Str("symbol", config.Symbol).Str("interval", config.Interval).Msg("Binance.Kline.Subscribe")
		go binance.WsKlineServe(
			config.Symbol,
			config.Interval,
			klineHandler,
			errHandler,
		)
	}
}
