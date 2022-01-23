package internal

import "github.com/adshao/go-binance/v2"

var CriticalErrorEvent string = "Event:CriticalError"

type CriticalErrorEventPayload struct {
	Error string `json:"error"`
}

var NotifyTradeEvent string = "Event:Notify:Trade"

type NotifyTradeEventPayload struct {
	ID       int64             `json:"id"`
	Side     binance.SideType  `json:"side"`
	Type     binance.OrderType `json:"type"`
	Symbol   string            `json:"symbol"`
	Price    float64           `json:"price"`
	Quantity string            `json:"quantity"`
}
