package internal

import (
	"time"

	"github.com/adshao/go-binance/v2"
)

var CriticalErrorEvent string = "Event:CriticalError"

type CriticalErrorEventPayload struct {
	Error string `json:"error"`
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
	ID       uint      `json:"id"`
	Symbol   string    `json:"symbol"`
	Entry    float64   `json:"entry"`
	Exit     float64   `json:"exit"`
	Quantity float64   `json:"quantity"`
	Time     time.Time `json:"time"`
}

var GetBalanceEvent string = "Event:Balance:Get"

type Balance struct {
	Asset  string  `json:"asset"`
	Amount float64 `json:"amount"`
}

type BalanceResponse struct {
	Test    bool      `json:"test"`
	Balance []Balance `json:"balance"`
}

var GetStatsEvent string = "Event:Stats:Get"

type Stats struct {
	Profit float64 `json:"profit"`
	Loss   float64 `json:"loss"`
	Total  float64 `json:"total"`
}

type StatsRequest struct {
	Symbol string `json:"symbol"`
}

type StatsResponse struct {
	Stats *Stats `json:"stats"`
}

var UpdateTradingEvent string = "Event:Trading:Update"

type UpdateTradingRequest struct {
	Symbol  string `json:"symbol"`
	Enabled bool   `json:"enabled"`
}

var DumpEvent string = "Event:Dump"

type DumpRequest struct {
	Symbol string `json:"symbol"`
}

type DumpResponse struct {
	ID       int64   `json:"id"`
	Quantity float64 `json:"quantity"`
}

var GetConfigsEvent string = "Event:Configs:Get"

type Configs struct {
	Symbol         string  `json:"symbol"`
	Minimum        float64 `json:"minimum"`
	AllowedAmount  float64 `json:"allowedAmount"`
	TradingEnabled bool    `json:"TradingEnabled"`
}

type ConfigsResponse struct {
	Configs []Configs `json:"configs"`
}
