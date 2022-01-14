package strategy

import (
	"fmt"
	"trader/exchange"

	"github.com/markcheno/go-talib"
)

var (
	TRADE_QUANTITY = 0.005 // get live data
)

type Rsi struct {
	id         string
	ex         exchange.Exchange
	period     int
	overbought int
	oversold   int
	closes     []float64
	holding    bool
	symbol     string
}

func NewRsi(id string, ex exchange.Exchange, overbought, oversold int, symbol string) Rsi {
	period := 14
	closes := []float64{}
	holding := false // TODO: make global event

	return Rsi{id, ex, period, overbought, oversold, closes, holding, symbol}
}

func (r Rsi) Run() {
	ch := make(chan exchange.Kline)

	go r.ex.Kline(r.symbol, "1m", ch)

	for {
		select {
		case k := <-ch:
			r.predict(k)
		}
	}
}

func (r *Rsi) predict(k exchange.Kline) {
	fmt.Println(r.id, k)

	// Return if Kline isn't closed yet
	if !k.Closed {
		return
	}

	r.closes = append(r.closes, k.Price)

	fmt.Printf("adding close price: %v\n", k.Price)

	if len(r.closes) > r.period {
		rsi := talib.Rsi(r.closes, r.period)
		last := rsi[len(rsi)-1]

		fmt.Printf("last rsi: %v\n", last)

		if last > float64(r.overbought) {
			if r.holding {
				fmt.Println("SELL")
			} else {
				fmt.Println("Overbought but not in position")
			}
		}

		if last < float64(r.oversold) {
			if r.holding {
				fmt.Println("Oversold but already in position")
			} else {
				fmt.Println("BUY")
			}
		}
	}
}
