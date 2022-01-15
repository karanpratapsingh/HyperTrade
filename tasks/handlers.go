package tasks

import (
	"context"
	"encoding/json"

	"github.com/hibiken/asynq"
	"github.com/rs/zerolog/log"
)

type Handlers struct {
	mux    *asynq.ServeMux
	server *asynq.Server
}

func NewHandlers(addr string) Handlers {
	mux := asynq.NewServeMux()

	server := asynq.NewServer(
		asynq.RedisClientOpt{Addr: addr},
		asynq.Config{
			StrictPriority: true,
		},
	)

	return Handlers{mux, server}
}

func (h Handlers) Run() {
	if err := h.server.Run(h.mux); err != nil {
		log.Error().Err(err).Msg("could not run server")
	}
}

func (h Handlers) SubscribeKline(fn func(payload KlinePayload) error) {
	h.mux.HandleFunc(Kline, func(ctx context.Context, t *asynq.Task) error {
		var payload KlinePayload

		if err := json.Unmarshal(t.Payload(), &payload); err != nil {
			return err
		}

		return fn(payload)
	})
}

func (h Handlers) SubscribeSignalBuy(fn func(payload SignalBuyPayload) error) {
	h.mux.HandleFunc(SignalBuy, func(ctx context.Context, t *asynq.Task) error {
		var payload SignalBuyPayload

		if err := json.Unmarshal(t.Payload(), &payload); err != nil {
			return err
		}

		return fn(payload)
	})
}

func (h Handlers) SubscribeSignalSell(fn func(payload SignalSellPayload) error) {
	h.mux.HandleFunc(SignalSell, func(ctx context.Context, t *asynq.Task) error {
		var payload SignalSellPayload

		if err := json.Unmarshal(t.Payload(), &payload); err != nil {
			return err
		}

		return fn(payload)
	})
}
