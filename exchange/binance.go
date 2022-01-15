package exchange

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"trader/events"
	"trader/types"

	"github.com/adshao/go-binance/v2"
	"github.com/gorilla/websocket"
	"github.com/rs/zerolog/log"
)

type Binance struct {
	client *binance.Client
	events events.Bus
	test   bool
}

func NewBinance(key, secret string, e events.Bus, test bool) Binance {
	log.Debug().Str("type", "binance").Bool("test", test).Msg("Init Exchange")

	binance.UseTestnet = test
	client := binance.NewClient(key, secret)

	return Binance{client, e, test}
}

func (Binance) Buy(ctx context.Context) {
	var _ float64 = 0.005 // get live quantity data

	panic("todo implement")
}

func (Binance) Sell(ctx context.Context) {
	panic("todo implement")
}

func (b Binance) Kline(symbol string, interval string) {
	// TODO: enable testnet
	stream := fmt.Sprintf("wss://stream.binance.com:9443/ws/%v@kline_%v", strings.ToLower(symbol), interval)
	conn, _, err := websocket.DefaultDialer.Dial(stream, nil)

	if err != nil {
		fmt.Println(err.Error())
	}
	defer conn.Close()

	log.Debug().Str("interval", interval).Str("symbol", symbol).Msg("Kline Subscribed")

	for {
		_, message, err := conn.ReadMessage()

		if err != nil {
			fmt.Println(err.Error())
			log.Error().Err(err).Msg("Kline ReadMessage")
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
		b.events.Publish(events.Kline, events.KlinePayload{k, symbol})
	}
}
