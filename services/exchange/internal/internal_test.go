package internal_test

import (
	"exchange/db"
	"exchange/internal"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestStats(t *testing.T) {
	type testCase struct {
		trades         []db.Trades
		expectedProfit float64
		expectedLoss   float64
	}

	var testCases = []testCase{
		{
			[]db.Trades{
				{1, "ETHUSDT", 2700, 2710, 0.0045, time.Now()},
			},
			0.04516666666666667,
			0,
		},
		{
			[]db.Trades{
				{1, "BTCUSDT", 42500, 42800, 0.004675, time.Now()},
			},
			1.4124,
			0,
		},
		{
			[]db.Trades{
				{1, "SOLUSDT", 80, 84, 1.5, time.Now()},
			},
			6.3,
			0,
		},
		{
			[]db.Trades{
				{1, "ADAUSDT", 0.827, 0.728, 20, time.Now()},
			},
			0,
			1.7429746070133008,
		},
	}

	for _, testCase := range testCases {
		stats := internal.CalculateStats(testCase.trades)

		assert.Equal(t, stats.Profit, testCase.expectedProfit)
		assert.Equal(t, stats.Loss, testCase.expectedLoss)
	}
}
