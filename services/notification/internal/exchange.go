package internal

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
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

func GetBalanceString() string {
	url := "http://exchange.default/balance"

	client := http.Client{
		Timeout: time.Second * 2,
	}

	req, err := http.NewRequest(http.MethodGet, url, nil)

	if err != nil {
		log.Error().Err(err).Msg("Internal.Exchange.GetBalance.NewRequest")
		return err.Error()
	}

	res, err := client.Do(req)

	if err != nil {
		log.Error().Err(err).Msg("Internal.Exchange.GetBalance.Get")
		return err.Error()
	}

	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)

	if err != nil {
		log.Error().Err(err).Msg("Internal.Exchange.GetBalance.ReadAll")
		return err.Error()
	}

	response := BalanceResponse{}

	if err := json.Unmarshal(body, &response); err != nil {
		log.Error().Err(err).Msg("Internal.Exchange.GetBalance.Unmarshal")
		return err.Error()
	}

	header := "Balance:"

	if response.Test {
		header = fmt.Sprintln("Test", header)
	}

	var balances = []string{header}
	var separator rune = '•'

	for _, balance := range response.Balance {
		b := fmt.Sprintf("%c %v %v", separator, balance.Asset, balance.Amount)
		balances = append(balances, b)
	}

	return strings.Join(balances, "\n")
}
