package events

import (
	"github.com/nats-io/nats.go"
	"github.com/rs/zerolog/log"
)

type PubSub struct {
	conn *nats.EncodedConn
}

func NewPubSub(addr string) PubSub {
	conn, err := nats.Connect(addr)

	if err != nil {
		log.Fatal().Err(err).Msg("PubSub.Init")
	}

	enc, err := nats.NewEncodedConn(conn, nats.JSON_ENCODER)

	if err != nil {
		log.Fatal().Err(err).Msg("PubSub.NATS.Encoder")
	}

	return PubSub{enc}
}

func (p PubSub) Close() {
	p.conn.Close()
}

func (p *PubSub) Subscribe(event string, handler interface{}) *nats.Subscription {
	sub, err := p.conn.Subscribe(event, handler)

	if err != nil {
		log.Error().Err(err).Str("event", event).Msg("PubSub.Subscribe")
	}

	return sub
}

func (p *PubSub) Publish(event string, payload interface{}) {
	err := p.conn.Publish(event, payload)

	if err != nil {
		log.Error().Err(err).Str("event", event).Msg("PubSub.Publish")
	}
}
