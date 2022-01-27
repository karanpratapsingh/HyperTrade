package internal

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/zerolog/log"
)

type Api struct{}

func NewApi() error {
	port := ":80"

	log.Trace().Str("port", port).Msg("Internal.Api.Init")

	router := mux.NewRouter()
	api := Api{}

	router.HandleFunc("/", api.healthcheck).Methods(http.MethodGet)

	err := http.ListenAndServe(port, router)
	return err
}

func (Api) healthcheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Healthy")
}
