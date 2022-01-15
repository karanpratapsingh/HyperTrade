package tasks

import "trader/types"

type SignalBuyPayload struct {
	Symbol string
}

type SignalSellPayload struct {
	Symbol string
}

type KlinePayload struct {
	Kline  types.Kline
	Symbol string
}
