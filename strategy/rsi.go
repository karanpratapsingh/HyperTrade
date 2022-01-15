package strategy

import (
	"trader/events"
	"trader/types"

	"github.com/markcheno/go-talib"
	"github.com/rs/zerolog/log"
)

var Period = 14

type RsiConfig struct {
	Overbought int
	Oversold   int
}
type Rsi struct {
	id      string
	bus     events.Bus
	config  RsiConfig
	closes  []float64
	holding bool
}

func NewRsi(id string, config RsiConfig, bus events.Bus) Rsi {
	log.Debug().Str("ID", id).Msg("Init Strategy")

	closes := []float64{}
	holding := false

	return Rsi{id, bus, config, closes, holding}
}

func (r *Rsi) Predict(k types.Kline, symbol string) {
	// Return if Kline isn't closed yet
	if !k.Closed {
		return
	}

	r.closes = append(r.closes, k.Price)

	log.Info().Str("symbol", symbol).Float64("price", k.Price).Bool("closed", k.Closed).Msg(r.id)

	if len(r.closes) > Period {
		rsi := talib.Rsi(r.closes, Period)
		last := rsi[len(rsi)-1]

		log.Debug().Str("symbol", symbol).Float64("last_rsi", last).Msg(r.id)

		if last > float64(r.config.Overbought) {
			if r.holding {
				r.bus.Publish(events.SignalSell, events.SignalSellPayload{symbol})
			} else {
				log.Warn().Msg("Overbought but not in position")
			}
		}

		if last < float64(r.config.Oversold) {
			if r.holding {
				log.Warn().Msg("Oversold but already in position")
			} else {
				r.bus.Publish(events.SignalBuy, events.SignalBuyPayload{symbol})
				r.holding = true
			}
		}
	}
}
