package internal

import "github.com/adshao/go-binance/v2"

var CriticalErrorEvent string = "Event:CriticalError"

type CriticalErrorEventPayload struct {
	Error string `json:"error"`
}

var KlineEvent string = "Event:Kline"

type KlinePayload struct {
	Kline Kline `json:"kline"`
}

var NotifyTradeEvent string = "Event:Notify:Trade"

type NotifyTradeEventPayload struct {
	ID       int64             `json:"id"`
	Side     binance.SideType  `json:"side"`
	Type     binance.OrderType `json:"type"`
	Symbol   string            `json:"symbol"`
	Price    float64           `json:"price"`
	Quantity float64            `json:"quantity"`
}

var DataFrameEvent string = "Event:DataFrame"

type DataFrameEventPayload struct {
	Open       float64    `json:"open"`
	Kline      Kline      `json:"kline"`
	Indicators Indicators `json:"indicators"`
	Signal     Signal     `json:"signal"`
}
