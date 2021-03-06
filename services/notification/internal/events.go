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

type GetBalanceResponse struct {
	Test    bool      `json:"test"`
	Balance []Balance `json:"balance"`
}

var GetPositionsEvent string = "Event:Positions:Get"

type Positions struct {
	Symbol   string    `json:"symbol"`
	Price    float64   `json:"price"`
	Quantity float64   `json:"quantity"`
	Time     time.Time `json:"time"`
}

type GetPositionsResponse struct {
	Positions []Positions `json:"positions"`
}

var GetStatsEvent string = "Event:Stats:Get"

type Stats struct {
	Profit float64 `json:"profit"`
	Loss   float64 `json:"loss"`
	Total  float64 `json:"total"`
}

type GetStatsResponse struct {
	Stats *Stats `json:"stats"`
}

var UpdateTradingEnabledEvent string = "Event:Config:Update:TradingEnabled"

type UpdateTradingEnabledRequest struct {
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
	Base           string  `json:"base"`
	Quote          string  `json:"quote"`
	Interval       string  `json:"interval"`
	Minimum        float64 `json:"minimum"`
	AllowedAmount  float64 `json:"allowed_amount"`
	TradingEnabled bool    `json:"trading_enabled"`
}

type GetConfigsResponse struct {
	Configs []Configs `json:"configs"`
}
