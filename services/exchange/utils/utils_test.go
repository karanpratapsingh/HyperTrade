package utils_test

import (
	"exchange/utils"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParseOrderQuantity(t *testing.T) {
	type testCase struct {
		quantity float64
		expected string
	}

	var testCases = []testCase{
		{0.12345678, "0.1234"},
		{0.98765432, "0.9876"},
		{0.90020, "0.9002"},
		{0.100, "0.1000"},
	}

	for _, testCase := range testCases {
		got := utils.ParseOrderQuantity(testCase.quantity)
		assert.Equal(t, got, testCase.expected)
	}
}

func TestGetMinQuantity(t *testing.T) {
	type testCase struct {
		min, price, expected float64
	}

	var testCases = []testCase{
		{12, 2500, 0.0048000000000000004},
		{10, 150, 0.06666666666666667},
		{15, 42000, 0.00035714285714285714},
		{25, 80, 0.3125},
	}

	for _, testCase := range testCases {
		got := utils.GetMinQuantity(testCase.min, testCase.price)
		assert.Equal(t, got, testCase.expected)
	}
}

func TestToFixed(t *testing.T) {
	type testCase struct {
		num       float64
		precision int
		expected  float64
	}

	var testCases = []testCase{
		{0.05, 2, 0.05},
		{0.0101, 2, 0.01},
		{1.2525, 4, 1.2525},
		{10.00001, 3, 10.000},
	}

	for _, testCase := range testCases {
		got := utils.ToFixed(testCase.num, testCase.precision)
		assert.Equal(t, got, testCase.expected)
	}
}

func TestParseFloat(t *testing.T) {
	type testCase struct {
		str      string
		expected float64
	}

	var testCases = []testCase{
		{"10.10", 10.10},
		{"0.00004", 0.00004},
	}

	for _, testCase := range testCases {
		got := utils.ParseFloat(testCase.str)
		assert.Equal(t, got, testCase.expected)
	}
}

func TestParseInt(t *testing.T) {
	type testCase struct {
		str      string
		expected int64
	}

	var testCases = []testCase{
		{"10", 10},
		{"20", 20},
	}

	for _, testCase := range testCases {
		got := utils.ParseInt(testCase.str)
		assert.Equal(t, got, testCase.expected)
	}
}
