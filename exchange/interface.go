package exchange

import "context"

type Exchange interface {
	Buy(ctx context.Context)
	Sell(ctx context.Context)
	Kline(symbol string, interval string)
}
