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

var SignalBuy string = "Event:Signal:Buy"

type SignalBuyPayload struct {
	Symbol string
}

var SignalSell string = "Event:Signal:Sell"

type SignalSellPayload struct {
	Symbol string
}

var NotifyTrade string = "Event:Notify:Trade"

type NotifyTradePayload struct {
	ID     int64
	Type   binance.SideType
	Symbol string
	Price  float64
	Amount float64
}
