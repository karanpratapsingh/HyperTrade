package exchange

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/adshao/go-binance/v2"
	"github.com/gorilla/websocket"
)

type Binance struct {
	client *binance.Client
	test   bool
}

type Kline struct {
	Price  float64
	Closed bool
}

func (k Kline) String() string {
	return fmt.Sprintf("price: %v, close: %v", k.Price, k.Closed)
}

func NewBinance(key, secret string, test bool) Binance {
	binance.UseTestnet = test
	client := binance.NewClient(key, secret)

	return Binance{client, test}
}

func (Binance) Buy(ctx context.Context) {
	panic("todo implement")
}

func (Binance) Sell(ctx context.Context) {
	panic("todo implement")
}

func (b Binance) Kline(symbol string, interval string, ch chan Kline) {
	// TODO: enable testnet
	stream := fmt.Sprintf("wss://stream.binance.com:9443/ws/%v@kline_%v", strings.ToLower(symbol), interval)
	conn, _, err := websocket.DefaultDialer.Dial(stream, nil)

	if err != nil {
		fmt.Println(err.Error())
	}
	defer conn.Close()

	// TODO: info
	// fmt.Println(response.Status)

	for {
		_, message, err := conn.ReadMessage()

		if err != nil {
			fmt.Println(err.Error())
		}

		data := map[string]map[string]interface{}{}
		json.Unmarshal(message, &data)

		kline := data["k"]
		price, err := strconv.ParseFloat(kline["c"].(string), 64)
		closed := kline["x"].(bool)

		if err != nil {
			// TODO: custom err
			fmt.Printf("parse err: %v\n", err)
		}

		k := Kline{price, closed}
		ch <- k
	}
}
