package internal

type Kline struct {
	Symbol string  `json:"symbol"`
	Time   int64   `json:"time"`
	Open   float64 `json:"open"`
	High   float64 `json:"high"`
	Low    float64 `json:"low"`
	Close  float64 `json:"close"`
	Volume float64 `json:"volume"`
	Final  bool    `json:"final"`
}

type Indicators struct {
	Adx        *float64 `json:"adx"`
	Rsi        *float64 `json:"rsi"`
	Macd       *float64 `json:"macd"`
	MacdSignal *float64 `json:"macd_signal"`
	MacdHist   *float64 `json:"macd_hist"`
}

type Signal string
