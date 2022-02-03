package internal

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/rs/zerolog/log"
)

type Balance struct {
	Asset  string  `json:"asset"`
	Amount float64 `json:"amount"`
}

type BalanceResponse struct {
	Test    bool      `json:"test"`
	Balance []Balance `json:"balance"`
}

var ProxyURL = "http://proxy.default:8080"

type Response *http.Response

func NewRequest(method, route string, body io.Reader) (*http.Response, error) {
	url := fmt.Sprintf("%v/%v", ProxyURL, route)

	client := http.Client{
		Timeout: 4 * time.Second,
	}

	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return nil, err
	}

	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	return res, err
}

func GetBalance() (BalanceResponse, error) {
	res, err := NewRequest(http.MethodGet, "exchange/balance", nil)
	response := BalanceResponse{}

	if err != nil {
		log.Error().Err(err).Msg("Request.Exchange.GetBalance.Get")
		return response, err
	}

	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	fmt.Print(string(body))
	if err != nil {
		log.Error().Err(err).Msg("Request.Exchange.GetBalance.ReadAll")
		return response, err
	}

	if err := json.Unmarshal(body, &response); err != nil {
		log.Error().Err(err).Msg("Request.Exchange.GetBalance.Unmarshal")
		return response, err
	}

	return response, nil
}

type Stats struct {
	Profit float64 `json:"profit"`
	Loss   float64 `json:"loss"`
	Total  float64 `json:"total"`
}

type StatsResponse struct {
	Stats *Stats `json:"stats"`
}

func GetStats() (StatsResponse, error) {
	res, err := NewRequest(http.MethodGet, "exchange/stats", nil)
	response := StatsResponse{}

	if err != nil {
		log.Error().Err(err).Msg("Request.Exchange.GetStats.Get")
		return response, err
	}

	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	fmt.Print(string(body))
	if err != nil {
		log.Error().Err(err).Msg("Request.Exchange.GetStats.ReadAll")
		return response, err
	}

	if err := json.Unmarshal(body, &response); err != nil {
		log.Error().Err(err).Msg("Request.Exchange.GetStats.Unmarshal")
		return response, err
	}

	return response, nil
}
