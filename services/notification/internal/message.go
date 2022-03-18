package internal

import (
	"fmt"
	"strings"
	"time"
)

func (t Telegram) FormatConfigsMessage(r GetConfigsResponse) string {
	header := "<b>Configs</b>"

	var configs = []string{header}

	for i, config := range r.Configs {
		index := i + 1
		c := fmt.Sprintf(
			"\n<pre>#%v\n"+
				"Symbol: %v\n"+
				"Base: %v\n"+
				"Quote: %v\n"+
				"Interval: %v\n"+
				"Minimum: %v %v\n"+
				"Allowed: %v %v\n"+
				"Enabled: %v</pre>",
			index,
			config.Symbol,
			config.Base,
			config.Quote,
			config.Interval,
			config.Minimum, config.Quote,
			config.AllowedAmount, config.Quote,
			config.TradingEnabled,
		)
		configs = append(configs, c)
	}

	return strings.Join(configs, "\n")
}

func (t Telegram) FormatPostionsMessage(r GetPositionsResponse) string {
	header := "<b>Positions</b>"

	var positions = []string{header}

	if len(r.Positions) == 0 {
		p := "\n<pre>No positions yet</pre>"

		positions = append(positions, p)
	}

	for i, position := range r.Positions {
		index := i + 1
		time := position.Time.Format(time.RFC822)

		p := fmt.Sprintf(
			"\n<pre>#%v\n"+
				"Symbol: %v\n"+
				"Price: %v\n"+
				"Quantity: %v\n"+
				"Time: %v</pre>",
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
		"<b>Created Order</b>\n\n"+
			"<pre>ID: %v\n"+
			"Side: %v\n"+
			"Type: %v\n"+
			"Symbol: %v\n"+
			"Price: %v\n"+
			"Quantity: %v</pre>",
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
		"<b>Executed Trade</b>\n\n"+
			"<pre>ID: %v\n"+
			"Symbol: %v\n"+
			"Entry: %v\n"+
			"Exit: %v\n"+
			"Quantity: %v\n"+
			"Time: %v</pre>",
		p.ID,
		p.Symbol,
		p.Entry,
		p.Exit,
		p.Quantity,
		time,
	)

	return message
}

func (t Telegram) FormatBalanceMessage(r GetBalanceResponse) string {
	header := "<b>Balance</b>\n"

	if r.Test {
		header = "<b>Test Balance</b>\n"
	}

	var balances = []string{header}
	var separator rune = '•'

	for _, balance := range r.Balance {
		b := fmt.Sprintf("<pre>%c %v %v</pre>", separator, balance.Asset, balance.Amount)
		balances = append(balances, b)
	}

	return strings.Join(balances, "\n")
}

func (t Telegram) FormatStatsMessage(r GetStatsResponse) string {
	var message string

	if r.Stats == nil {
		message = "<b>Stats</b>\n\n<pre>No data available yet</pre>"
	} else {
		message = fmt.Sprintf("<b>Stats</b>\n\n<pre>Profit: %.4f\nLoss: %.4f</pre>", r.Stats.Profit, r.Stats.Loss)
	}

	return message
}

func (t Telegram) FormatDumpMessage(symbol string, r DumpResponse) string {
	message := fmt.Sprintf("<b>Dump</b>\n\n<pre>ID: %v\nSymbol: %v\nQuantity: %v</pre>", r.ID, symbol, r.Quantity)

	return message
}

func (t Telegram) FormatErrorMessage(p CriticalErrorEventPayload) string {
	message := fmt.Sprintf("<b>Critical Error</b>\n\n<pre>%v</pre>", p.Error)

	return message
}

func (t Telegram) FormatUpdateTradingMessage(symbol string, enable bool) string {
	var message string

	var payload interface{}
	req := UpdateTradingEnabledRequest{symbol, enable}
	err := t.pubsub.Request(UpdateTradingEnabledEvent, req, &payload)

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
		message = fmt.Sprintf("<b>Message</b>\n\n<pre>Trading has been %s for %s</pre>", status, symbol)
	}

	return message
}

func (t Telegram) FormatSymbolErrorMessage(command string) string {

	return fmt.Sprintf("<b>Error</b>\n\n<pre>Invalid symbol, please try again.\n\nUsage: /%s symbol</pre>", command)
}
