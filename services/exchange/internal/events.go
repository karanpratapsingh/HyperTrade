package internal

import (
	"exchange/db"
	"time"

	"github.com/adshao/go-binance/v2"
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
	ID       uint      `json:"id"`
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

var GetBalanceEvent string = "Event:Balance:Get"

type Balance struct {
	Asset  string  `json:"asset"`
	Amount float64 `json:"amount"`
}

type BalanceResponse struct {
	Test    bool      `json:"test"`
	Balance []Balance `json:"balance"`
}

var GetPositionsEvent string = "Event:Positions:Get"

type PositionsResponse struct {
	Positions []db.Positions `json:"positions"`
}

var GetTradesEvent string = "Event:Trades:Get"

type TradesResponse struct {
	Trades []db.Trades `json:"trades"`
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

var GetDataFrameEvent string = "Event:DataFrame:Get"

type DataFrameRequest struct {
	Size int `json:"size"`
}

type DataFrameResponse struct {
	DataFrame []DataFrameEventPayload `json:"dataframe"`
}

var UpdateTradingEvent string = "Event:Trading:Update"

type UpdateTradingRequest struct {
	Symbol  string `json:"symbol"`
	Enabled bool   `json:"enabled"`
}
