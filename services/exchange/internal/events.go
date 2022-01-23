package internal

import (
	"time"

	"github.com/adshao/go-binance/v2"
	"github.com/google/uuid"
)

var CriticalErrorEvent string = "Event:CriticalError"

type CriticalErrorEventPayload struct {
	Error string `json:"error"`
}

var KlineEvent string = "Event:Kline"

type KlinePayload struct {
	Kline Kline `json:"kline"`
}

var OrderEvent string = "Event:Order"

type OrderEventPayload struct {
	ID       int64             `json:"id"`
	Side     binance.SideType  `json:"side"`
	Type     binance.OrderType `json:"type"`
	Symbol   string            `json:"symbol"`
	Price    float64           `json:"price"`
	Quantity float64           `json:"quantity"`
}

var TradeEvent string = "Event:Trade"

type TradeEventPayload struct {
	ID       uuid.UUID `json:"id"`
	Symbol   string    `json:"symbol"`
	Entry    float64   `json:"entry"`
	Exit     float64   `json:"exit"`
	Quantity float64   `json:"quantity"`
	Time     time.Time `json:"time"`
}

var DataFrameEvent string = "Event:DataFrame"

type DataFrameEventPayload struct {
	Open       float64    `json:"open"`
	Kline      Kline      `json:"kline"`
	Indicators Indicators `json:"indicators"`
	Signal     Signal     `json:"signal"`
}
