package internal

import (
	"encoding/json"
	"exchange/db"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/zerolog/log"
)

type Api struct {
	db       db.DB
	exchange Binance
	pubsub   PubSub
}

func NewApi(db db.DB, exchange Binance, pubsub PubSub) error {
	port := ":80"

	log.Trace().Str("port", port).Msg("Internal.Api.Init")

	router := mux.NewRouter()
	api := Api{db, exchange, pubsub}

	router.HandleFunc("/healthz", api.healthcheck).Methods(http.MethodGet)
	router.HandleFunc("/dataframe", api.dataframe).Methods(http.MethodGet)
	router.HandleFunc("/balance", api.balance).Methods(http.MethodGet)
	router.HandleFunc("/trades", api.trades).Methods(http.MethodGet)
	router.HandleFunc("/positions", api.positions).Methods(http.MethodGet)
	router.HandleFunc("/stats", api.stats).Methods(http.MethodGet)

	err := http.ListenAndServe(port, router)
	return err
}

type HealthzResponse struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

func (Api) healthcheck(w http.ResponseWriter, r *http.Request) {
	response := HealthzResponse{
		Status:  200,
		Message: "Healthy",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

type DataFrameResponse struct {
	DataFrame []DataFrameEventPayload `json:"dataframe"`
}

func (a Api) dataframe(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	size := query.Get("size")

	var response DataFrameResponse
	var data []DataFrameEventPayload

	if size == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	js := a.pubsub.JetStream()
	sub, err := js.PullSubscribe(DataFrameEvent, "client")

	if err != nil {
		log.Error().Err(err).Msg("Internal.Api.DataFrame.PullSubscribe")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	batch := int(parseInt(size))
	msgs, err := sub.Fetch(batch)

	if err != nil {
		log.Error().Err(err).Msg("Internal.Api.DataFrame.Fetch")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	for _, msg := range msgs {
		var frame DataFrameEventPayload

		if err := json.Unmarshal(msg.Data, &frame); err != nil {
			log.Error().Err(err).Msg("Internal.Api.DataFrame.Unmarshal")
			return
		}

		data = append(data, frame)
	}

	response.DataFrame = data

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

type Balance struct {
	Asset  string  `json:"asset"`
	Amount float64 `json:"amount"`
}

type BalanceResponse struct {
	Test    bool      `json:"test"`
	Balance []Balance `json:"balance"`
}

func (a Api) balance(w http.ResponseWriter, r *http.Request) {
	response := BalanceResponse{
		Test:    a.exchange.test,
		Balance: a.exchange.GetBalance(),
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

type TradesResponse struct {
	Trades []db.Trades `json:"trades"`
}

func (a Api) trades(w http.ResponseWriter, r *http.Request) {
	response := TradesResponse{
		Trades: a.db.GetTrades(),
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

type PositionsResponse struct {
	Positions []db.Positions `json:"positions"`
}

func (a Api) positions(w http.ResponseWriter, r *http.Request) {
	response := PositionsResponse{
		Positions: a.db.GetPositions(),
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

type Stats struct {
	Profit float64 `json:"profit"`
	Loss   float64 `json:"loss"`
	Total  float64 `json:"total"`
}

type StatsResponse struct {
	Stats *Stats `json:"stats"`
}

func (a Api) stats(w http.ResponseWriter, r *http.Request) {
	enc := json.NewEncoder(w)
	query := r.URL.Query()
	symbol := query.Get("symbol")

	var response StatsResponse
	var stats Stats

	trades := a.db.GetTrades()
	config := a.db.GetConfig(symbol)

	if symbol == "" || config.Symbol == "" {
		w.WriteHeader(http.StatusBadRequest)
		enc.Encode(response)
		return
	}

	if len(trades) != 0 {
		for _, trade := range trades {
			percentage := ((trade.Exit - trade.Entry) / trade.Entry) * 100
			amount := percentage * config.AllowedAmount

			if amount > 0 {
				stats.Profit += amount
			} else {
				stats.Loss += -1 * amount
			}
		}

		stats.Total = stats.Profit + stats.Loss
		response = StatsResponse{&stats}
	}

	w.WriteHeader(http.StatusOK)
	enc.Encode(response)
}
