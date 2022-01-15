package events

import (
	"trader/types"

	"github.com/asaskevich/EventBus"
)

type Bus EventBus.Bus

var (
	SignalBuy  = "event:signal:buy"
	SignalSell = "event:signal:sell"
	Kline      = "event:kline"
)

type SignalBuyPayload struct{
	Symbol string
}

type SignalSellPayload struct{
	Symbol string
}

type KlinePayload struct {
	Kline  types.Kline
	Symbol string
}

func NewEventBus() Bus {
	return EventBus.New()
}
