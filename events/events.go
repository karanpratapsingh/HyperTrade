package events

import (
	"trader/types"

	"github.com/adshao/go-binance/v2"
)

var Kline string = "Event:Kline"

type KlinePayload struct {
	Kline  types.Kline
	Symbol string
}

var SignalTrade string = "Event:Signal:Trade"

type SignalTradePayload struct {
	Side   binance.SideType
	Symbol string
	Price  float64
}

var NotifyTrade string = "Event:Notify:Trade"

type NotifyTradePayload struct {
	ID       int64
	Side     binance.SideType
	Type     binance.OrderType
	Symbol   string
	Price    float64
	Quantity string
}
