package internal

import (
	"fmt"
	"strings"
	"time"
)

func (t Telegram) FormatConfigsMessage(r ConfigsResponse) string {
	header := "*Configs*"

	var configs = []string{header}

	for i, config := range r.Configs {
		index := i + 1
		c := fmt.Sprintf(
			"\n\\#%v\n"+
				"Symbol: %v\n"+
				"Minimum: %v\n"+
				"Allowed: %v\n"+
				"Enabled: %v",
			index,
			config.Symbol,
			config.Minimum,
			config.AllowedAmount,
			config.TradingEnabled,
		)
		configs = append(configs, c)
	}

	return strings.Join(configs, "\n")
}

func (t Telegram) FormatPostionsMessage(r PositionsResponse) string {
	header := "*Positions*"

	var positions = []string{header}

	if len(r.Positions) == 0 {
		p := "\nNo positions yet"

		positions = append(positions, p)
	}

	for i, position := range r.Positions {
		index := i + 1
		time := position.Time.Format(time.RFC822)

		p := fmt.Sprintf(
			"\n\\#%v\n"+
				"Symbol: %v\n"+
				"Price: %v\n"+
				"Quantity: %v\n"+
				"Time: %v",
			index,
			position.Symbol,
			position.Price,
			position.Quantity,
			time,
		)
		positions = append(positions, p)
	}

	return strings.Join(positions, "\n")
}

func (t Telegram) FormatOrderMessage(p OrderEventPayload) string {
	message := fmt.Sprintf(
		"*Created Order*\n\n"+
			"ID: %v\n"+
			"Side: %v\n"+
			"Type: %v\n"+
			"Symbol: %v\n"+
			"Price: %v\n"+
			"Quantity: %v",
		p.ID,
		p.Side,
		p.Type,
		p.Symbol,
		p.Price,
		p.Quantity,
	)

	return message
}

func (t Telegram) FormatTradeMessage(p TradeEventPayload) string {
	time := p.Time.Format(time.RFC822)

	message := fmt.Sprintf(
		"*Executed Trade*\n\n"+
			"ID: %v\n"+
			"Symbol: %v\n"+
			"Entry: %v\n"+
			"Exit: %v\n"+
			"Quantity: %v\n"+
			"Time: %v",
		p.ID,
		p.Symbol,
		p.Entry,
		p.Exit,
		p.Quantity,
		time,
	)

	return message
}

func (t Telegram) FormatBalanceMessage(r BalanceResponse) string {
	header := "*Balance*\n"

	if r.Test {
		header = fmt.Sprintln("*Test*", header)
	}

	var balances = []string{header}
	var separator rune = '•'

	for _, balance := range r.Balance {
		b := fmt.Sprintf("%c %v %v", separator, balance.Asset, balance.Amount)
		balances = append(balances, b)
	}

	return strings.Join(balances, "\n")
}

func (t Telegram) FormatStatsMessage(r StatsResponse) string {
	var message string

	if r.Stats == nil {
		message = "*Stats*\n\nNo data available yet"
	} else {
		message = fmt.Sprintf("*Stats*\n\nProfit: %.4f\nLoss: %.4f", r.Stats.Profit, r.Stats.Loss)
	}

	return message
}

func (t Telegram) FormatDumpMessage(symbol string, r DumpResponse) string {
	message := fmt.Sprintf("*Dump*\n\nID: %v\nSymbol: %v\nQuantity: %v", r.ID, symbol, r.Quantity)

	return message
}

func (t Telegram) FormatErrorMessage(p CriticalErrorEventPayload) string {
	message := fmt.Sprintf("*Critical Error*\n\n%v", p.Error)

	return message
}

func (t Telegram) FormatUpdateTradingMessage(symbol string, enable bool) string {
	var message string

	var payload interface{}
	req := UpdateTradingRequest{symbol, enable}
	err := t.pubsub.Request(UpdateTradingEvent, req, &payload)

	if err != nil {
		message = err.Error()
	} else {
		var status string

		switch enable {
		case true:
			status = "enabled"
		case false:
			status = "disabled"
		}
		message = fmt.Sprintf("*Message*\n\nTrading has been %v", status)
	}

	return message
}
