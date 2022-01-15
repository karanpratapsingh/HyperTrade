package strategy

import (
	"trader/tasks"
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
	id     string
	config RsiConfig
	task   tasks.Tasks
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

func NewRsi(id string, config RsiConfig, task tasks.Tasks, symbols []string) Rsi {
	log.Debug().Str("ID", id).Msg("Init Strategy")

	states := makeState(symbols)

	return Rsi{id, config, task, states}
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

		log.Debug().Str("symbol", symbol).Float64("last_rsi", last).Msg(r.id)

		if last > float64(r.config.Overbought) {
			if state.holding {
				r.task.NewTask(tasks.SignalSell, tasks.SignalSellPayload{symbol})
			} else {
				log.Warn().Msg("Overbought but not in position")
			}
		}

		if last < float64(r.config.Oversold) {
			if state.holding {
				log.Warn().Msg("Oversold but already in position")
			} else {
				r.task.NewTask(tasks.SignalBuy, tasks.SignalBuyPayload{symbol})
				state.holding = true
			}
		}
	}
}
