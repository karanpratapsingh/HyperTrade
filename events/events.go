package events

import "trader/types"

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
