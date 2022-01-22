package internal

import "github.com/adshao/go-binance/v2"

var CriticalErrorEvent string = "Event:CriticalError"

type CriticalErrorEventPayload struct {
	Error string
}

var NotifyTradeEvent string = "Event:Notify:Trade"

type NotifyTradeEventPayload struct {
	ID       int64
	Side     binance.SideType
	Type     binance.OrderType
	Symbol   string
	Price    float64
	Quantity string
}
