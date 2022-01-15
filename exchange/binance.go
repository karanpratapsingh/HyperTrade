package exchange

import (
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

func NewBinance(key, secret string, bus events.Bus, test bool) Binance {
	log.Debug().Str("type", "binance").Bool("test", test).Msg("Init Exchange")

	binance.UseTestnet = test
	client := binance.NewClient(key, secret)

	return Binance{client, bus, test}
}

func (Binance) Buy(symbol string) {
	// TODO: get live quantity data for $1
	panic("todo impl.")
}

func (Binance) Sell(symbol string) {
	panic("todo impl.")
}

func (b Binance) Kline(symbol string, interval string) {
	var host string = "stream.binance.com:9443"

	if b.test {
		host = "testnet.binance.vision"
	}

	url := fmt.Sprintf("wss://%v/ws/%v@kline_%v", host, strings.ToLower(symbol), interval)
	conn, _, err := websocket.DefaultDialer.Dial(url, nil)

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
