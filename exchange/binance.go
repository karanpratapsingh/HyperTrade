package exchange

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"trader/tasks"
	"trader/types"

	"github.com/adshao/go-binance/v2"
	"github.com/gorilla/websocket"
	"github.com/rs/zerolog/log"
)

type Binance struct {
	client *binance.Client
	task   tasks.Tasks
	test   bool
}

func NewBinance(key, secret string, task tasks.Tasks, test bool) Binance {
	log.Debug().Str("type", "binance").Bool("test", test).Msg("Init Exchange")

	binance.UseTestnet = test
	client := binance.NewClient(key, secret)

	return Binance{client, task, test}
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
	log.Info().Str("symbol", symbol).Msg(tasks.SignalBuy)
	return nil
}

func (Binance) Sell(symbol string) error {
	log.Info().Str("symbol", symbol).Msg(tasks.SignalSell)
	return nil
}

func (b Binance) Kline(symbol string, interval string) {
	var host string = "stream.binance.com:9443"

	if b.test {
		host = "testnet.binance.vision"
	}

	url := fmt.Sprintf("wss://%v/ws/%v@kline_%v", host, strings.ToLower(symbol), interval)
	conn, _, err := websocket.DefaultDialer.Dial(url, nil)

	if err != nil {
		log.Error().Err(err).Msg("Kline Connection")
		return
	}

	defer conn.Close()

	log.Debug().Str("interval", interval).Str("symbol", symbol).Msg("Kline Subscribed")

	for {
		msgType, message, err := conn.ReadMessage()

		if err != nil {
			log.Error().Int("type", msgType).Err(err).Msg("Kline ReadMessage")
			continue
		}

		data := map[string]map[string]interface{}{}
		json.Unmarshal(message, &data)

		kline := data["k"]
		price, err := strconv.ParseFloat(kline["c"].(string), 64)
		closed := kline["x"].(bool)

		if err != nil {
			log.Error().Err(err).Msg("Parse err")
		}

		k := types.Kline{price, closed}
		b.task.NewTask(tasks.Kline, tasks.KlinePayload{k, symbol})
	}
}
