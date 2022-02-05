package internal

func RunAsyncApi(telegram Telegram, pubsub PubSub) {
	pubsub.Subscribe(OrderEvent, func(p OrderEventPayload) {
		message := telegram.FormatOrderMessage(p)
		telegram.SendMessage(OrderEvent, message)
	})

	pubsub.Subscribe(TradeEvent, func(p TradeEventPayload) {
		message := telegram.FormatTradeMessage(p)
		telegram.SendMessage(TradeEvent, message)
	})

	pubsub.Subscribe(CriticalErrorEvent, func(p CriticalErrorEventPayload) {
		message := telegram.FormatErrorMessage(p)
		telegram.SendMessage(CriticalErrorEvent, message)
	})
}
