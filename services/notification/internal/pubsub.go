package internal

import (
	"time"

	"github.com/nats-io/nats.go"
	"github.com/rs/zerolog/log"
)

type PubSub struct {
	conn *nats.EncodedConn
}

func NewPubSub(addr, user, password string) PubSub {
	conn, err := nats.Connect(addr, nats.UserInfo(user, password))

	if err != nil {
		log.Fatal().Err(err).Msg("PubSub.Init")
	}

	enc, err := nats.NewEncodedConn(conn, nats.JSON_ENCODER)

	if err != nil {
		log.Fatal().Err(err).Msg("PubSub.NATS.Encoder")
	}

	return PubSub{enc}
}

func (p *PubSub) Subscribe(event string, handler any) *nats.Subscription {
	sub, err := p.conn.Subscribe(event, handler)

	if err != nil {
		log.Error().Err(err).Str("event", event).Msg("PubSub.Subscribe")
	}

	return sub
}

func (p *PubSub) Publish(event string, payload any) {
	err := p.conn.Publish(event, payload)

	if err != nil {
		log.Error().Err(err).Str("event", event).Msg("PubSub.Publish")
	}
}

func (p PubSub) Request(event string, payload any, response any) error {
	err := p.conn.Request(event, payload, response, 5*time.Second)

	if err != nil {
		log.Error().Err(err).Str("event", event).Msg("PubSub.Request")
	}

	return err
}

func (p PubSub) Close() {
	p.conn.Close()
}
