package strategy

import (
	"trader/events"
	"trader/types"

	"github.com/markcheno/go-talib"
	"github.com/rs/zerolog/log"
)

var Period = 14

type RsiConfig struct {
	Overbought float64
	Oversold   float64
}
type Rsi struct {
	id     string
	config RsiConfig
	pubsub events.PubSub
	states map[string]*State
}

type State struct {
	closes  []float64
	holding bool
}

// Init state map for each symbol
func makeState(symbols []string) map[string]*State {
	states := make(map[string]*State)

	for _, symbol := range symbols {
		closes := []float64{}
		holding := false

		state := State{closes, holding}
		states[symbol] = &state
	}

	return states
}

func NewRsi(id string, config RsiConfig, pubsub events.PubSub, symbols []string) Rsi {
	log.Trace().
		Str("ID", id).
		Float64("overbought", config.Overbought).Float64("oversold", config.Oversold).
		Msg("Strategy.RSI.Init")

	states := makeState(symbols)

	return Rsi{id, config, pubsub, states}
}

func (r *Rsi) GetState(symbol string) State {
	return *r.states[symbol]
}

func (r *Rsi) Predict(k types.Kline, symbol string) {
	// Return if Kline isn't closed yet
	if !k.Closed {
		return
	}

	state := r.states[symbol]

	state.closes = append(state.closes, k.Price)

	log.Info().Str("symbol", symbol).Float64("price", k.Price).Bool("closed", k.Closed).Msg(r.id)

	if len(state.closes) > Period {
		rsi := talib.Rsi(state.closes, Period)
		last := rsi[len(rsi)-1]

		log.Trace().Str("symbol", symbol).Float64("last_rsi", last).Msg(r.id)

		if last > r.config.Overbought {
			if state.holding {
				r.pubsub.Publish(events.SignalSell, events.SignalSellPayload{symbol})
			} else {
				log.Warn().Str("symbol", symbol).Float64("last_rsi", last).Msg("RSI.Overbought.NoPosition")
			}
		}

		if last < r.config.Oversold {
			if state.holding {
				log.Warn().Str("symbol", symbol).Float64("last_rsi", last).Msg("RSI.Oversold.InPosition")
			} else {
				r.pubsub.Publish(events.SignalBuy, events.SignalBuyPayload{symbol})
				state.holding = true
			}
		}
	}
}
