package internal

import (
	"encoding/json"
	"exchange/db"
	"exchange/utils"

	"github.com/adshao/go-binance/v2"
	"github.com/nats-io/nats.go"
	"github.com/rs/zerolog/log"
)

func RunAsyncApi(db db.DB, exchange Binance, pubsub PubSub) {
	log.Trace().Msg("Internal.AsyncApi.Init")

	pubsub.Subscribe(DataFrameEvent, func(p DataFrameEventPayload) {
		ListenTrade(db, pubsub, exchange, p.Kline, p.Signal)
	})

	pubsub.Subscribe(GetBalanceEvent, func(m *nats.Msg) {
		response := BalanceResponse{
			Test:    exchange.test,
			Balance: exchange.GetBalance(),
		}

		pubsub.Publish(m.Reply, response)
	})

	pubsub.Subscribe(GetPositionsEvent, func(m *nats.Msg) {
		response := PositionsResponse{
			Positions: db.GetPositions(),
		}

		pubsub.Publish(m.Reply, response)
	})

	pubsub.Subscribe(GetTradesEvent, func(m *nats.Msg) {
		response := TradesResponse{
			Trades: db.GetTrades(),
		}

		pubsub.Publish(m.Reply, response)
	})

	pubsub.Subscribe(GetStatsEvent, func(m *nats.Msg) {
		var response StatsResponse
		var stats Stats

		var request StatsRequest
		utils.Unmarshal(m.Data, &request)

		trades := db.GetTrades()
		config := db.GetConfig(request.Symbol)

		if len(trades) != 0 {
			for _, trade := range trades {
				percentage := ((trade.Exit - trade.Entry) / trade.Entry) * 100
				amount := (percentage * config.AllowedAmount) / 100

				if amount > 0 {
					stats.Profit += amount
				} else {
					stats.Loss += -1 * amount
				}
			}

			stats.Total = stats.Profit + stats.Loss
			response = StatsResponse{&stats}
		}

		pubsub.Publish(m.Reply, response)
	})

	pubsub.Subscribe(GetDataFrameEvent, func(m *nats.Msg) {
		var request DataFrameRequest
		utils.Unmarshal(m.Data, &request)

		var response DataFrameResponse
		var data []DataFrameEventPayload

		js := pubsub.JetStream()
		sub, err := js.PullSubscribe(DataFrameEvent, "client")

		if err != nil {
			log.Error().Err(err).Msg("Internal.DataFrame.PullSubscribe")
			return
		}

		msgs, err := sub.Fetch(request.Size)

		if err != nil {
			log.Error().Err(err).Msg("Internal.DataFrame.Fetch")
			return
		}

		for _, msg := range msgs {
			var frame DataFrameEventPayload

			if err := json.Unmarshal(msg.Data, &frame); err != nil {
				log.Error().Err(err).Msg("Internal.DataFrame.Unmarshal")
				return
			}

			data = append(data, frame)
		}

		response.DataFrame = data

		pubsub.Publish(m.Reply, response)
	})
}

func ListenTrade(DB db.DB, pubsub PubSub, exchange Binance, kline Kline, signal Signal) {
	side := getSide(signal)

	if side == "" {
		return
	}

	symbol := kline.Symbol

	log.Trace().Str("symbol", symbol).Interface("side", side).Msg("Trade.Listen")

	position := DB.GetPosition(symbol)
	var holding bool = position.Symbol != ""

	config := DB.GetConfig(symbol)

	allowedAmt := config.AllowedAmount
	closePrice := kline.Close

	switch side {
	case binance.SideTypeBuy:
		if holding {
			log.Warn().Bool("holding", holding).Msg("Trade.Buy.Skip")
			return
		}

		quantity := utils.GetMinQuantity(allowedAmt, closePrice)

		err := exchange.Trade(binance.SideTypeBuy, symbol, closePrice, quantity)
		if err != nil {
			return
		}

		DB.CreatePosition(symbol, closePrice, quantity)
		log.Trace().Float64("price", closePrice).Float64("quantity", quantity).Msg("Trade.Buy.Complete")

	case binance.SideTypeSell:
		if !holding {
			log.Warn().Bool("holding", holding).Msg("Trade.Sell.Skip")
			return
		}

		quantity, err := exchange.GetBalanceQuantity(symbol)

		if err != nil {
			return
		}

		err = exchange.Trade(binance.SideTypeSell, symbol, closePrice, quantity)

		if err != nil {
			return
		}

		entry := position.Price
		DB.DeletePosition(symbol)
		trade := DB.CreateTrade(symbol, entry, closePrice, quantity)

		payload := TradeEventPayload{trade.ID, trade.Symbol, trade.Entry, trade.Exit, trade.Quantity, trade.Time}
		pubsub.Publish(TradeEvent, payload)

		log.Trace().Float64("price", closePrice).Float64("quantity", quantity).Msg("Trade.Sell.Complete")
	default:
	}
}

func getSide(signal Signal) binance.SideType {
	var side binance.SideType

	if signal.Buy && !signal.Sell {
		side = binance.SideTypeBuy
	} else if signal.Sell && !signal.Buy {
		side = binance.SideTypeSell
	}

	return side
}
