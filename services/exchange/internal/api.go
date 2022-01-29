package internal

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/zerolog/log"
)

type Api struct {
	exchange Binance
}

func NewApi(exchange Binance) error {
	port := ":80"

	log.Trace().Str("port", port).Msg("Internal.Api.Init")

	router := mux.NewRouter()
	api := Api{exchange}

	router.HandleFunc("/healthz", api.healthcheck).Methods(http.MethodGet)
	router.HandleFunc("/balance", api.balance).Methods(http.MethodGet)

	err := http.ListenAndServe(port, router)
	return err
}

type HealthzResponse struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

func (Api) healthcheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	response := HealthzResponse{
		Status:  200,
		Message: "Healthy",
	}

	json.NewEncoder(w).Encode(response)
}

type BalanceResponse struct {
	Balance []Balance `json:"balance"`
}

func (a Api) balance(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	response := BalanceResponse{
		Balance: a.exchange.GetBalance(),
	}
	json.NewEncoder(w).Encode(response)
}
