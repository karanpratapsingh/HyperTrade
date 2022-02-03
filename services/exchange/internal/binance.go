package internal

import (
	"context"
	"fmt"
	"math"
	"strconv"
	"strings"
	"time"

	"github.com/adshao/go-binance/v2"
	"github.com/rs/zerolog/log"
)

var ZeroBalance = 0.00000000

type Binance struct {
	client *binance.Client
	pubsub PubSub
	test   bool
}

func NewBinance(key, secret string, pubsub PubSub, test bool) Binance {
	log.Trace().Str("type", "binance").Bool("test", test).Msg("Binance.Init")

	binance.UseTestnet = test
	client := binance.NewClient(key, secret)

	return Binance{client, pubsub, test}
}

func (b Binance) GetAccount() *binance.Account {
	svc := b.client.NewGetAccountService()
	account, err := svc.Do(context.Background())

	if err != nil {
		log.Error().Err(err).Msg("Binance.UserInfo")
	}

	return account
}

func (b Binance) PrintAccountInfo() {
	acc := b.GetAccount()

	fmt.Println("-------- Account Info --------")
	fmt.Println("Type:", acc.AccountType)
	fmt.Println("Can Trade:", acc.CanTrade)
	fmt.Println("Test Mode:", b.test)
	fmt.Println(b.GetBalanceString())
	fmt.Println("------------------------------")
}

type Balance struct {
	Asset  string  `json:"asset"`
	Amount float64 `json:"amount"`
}

func (b Binance) GetBalance() []Balance {
	acc := b.GetAccount()
	balances := []Balance{}

	for _, balance := range acc.Balances {
		asset := balance.Asset
		amt := parseFloat(balance.Free)

		if amt > ZeroBalance {
			b := Balance{asset, amt}
			balances = append(balances, b)
		}
	}

	return balances
}

func (b Binance) GetBalanceString() string {
	userBalances := b.GetBalance()

	header := "Balance:"

	if b.test {
		header = fmt.Sprintln("Test", header)
	}

	var balances = []string{header}
	var separator rune = '•'

	for _, balance := range userBalances {
		b := fmt.Sprintf("%c %v %v", separator, balance.Asset, balance.Amount)
		balances = append(balances, b)
	}

	return strings.Join(balances, "\n")
}

func (b Binance) Trade(side binance.SideType, symbol string, price, quantity float64) error {
	log.Info().Interface("side", side).Str("symbol", symbol).Float64("quantity", quantity).Msg("Binance.Trade.Init")

	order, err := b.client.NewCreateOrderService().
		Symbol(symbol).
		Side(side).
		Type(binance.OrderTypeMarket).
		Quantity(fmt.Sprintf("%f", quantity)).
		Do(context.Background())

	if err != nil {
		log.Error().Interface("side", side).Float64("price", price).Float64("quantity", quantity).Err(err).Msg("Binance.Trade")
		b.pubsub.Publish(CriticalErrorEvent, CriticalErrorEventPayload{err.Error()})
		return err
	}

	log.Info().Interface("side", side).Float64("price", price).Float64("quantity", quantity).Msg("Binance.Trade.Order")

	payload := OrderEventPayload{order.OrderID, order.Side, order.Type, symbol, price, quantity}
	b.pubsub.Publish(OrderEvent, payload)

	return nil
}

func (b Binance) Kline(symbol string, interval string) {
	log.Info().Str("symbol", symbol).Str("interval", interval).Msg("Binance.Kline.Subscribe")

	wsKlineHandler := func(event *binance.WsKlineEvent) {
		symbol := event.Kline.Symbol
		time := time.Now().Unix() * 1000
		open := parseFloat(event.Kline.Open)
		high := parseFloat(event.Kline.High)
		low := parseFloat(event.Kline.Low)
		close := parseFloat(event.Kline.Close)
		volume := parseFloat(event.Kline.Volume)
		final := event.Kline.IsFinal

		kline := Kline{symbol, time, open, high, low, close, volume, final}

		if kline.Final {
			log.Info().
				Str("symbol", symbol).
				Float64("open", open).
				Float64("high", high).
				Float64("low", low).
				Float64("close", close).
				Float64("volume", volume).
				Bool("final", final).
				Msg(KlineEvent)

			b.pubsub.Publish(KlineEvent, KlinePayload{kline})
		}
	}

	errHandler := func(err error) {
		log.Error().Err(err).Msg("Binance.Kline.Error")

		// Try to restart ws connection
		log.Warn().Msg("Binance.Kline.Recover")
		b.Kline(symbol, interval)
	}

	binance.WsKlineServe(symbol, interval, wsKlineHandler, errHandler)
}

// Ref: https://www.binance.com/api/v3/exchangeInfo?symbol=$SYMBOL
func GetMinQuantity(min float64, price float64) float64 {
	quantity := toFixed((1/price)*min, 5)
	return quantity
}

func round(num float64) int {
	return int(num + math.Copysign(0.5, num))
}

func toFixed(num float64, precision int) float64 {
	output := math.Pow(10, float64(precision))
	return float64(round(num*output)) / output
}

func parseFloat(str string) float64 {
	float, err := strconv.ParseFloat(str, 64)

	if err != nil {
		log.Error().Err(err).Msg("Parser.Float64")
	}

	return float
}
