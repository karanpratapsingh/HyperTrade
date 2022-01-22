import talib
import numpy
from utils.pubsub import PubSub
from utils.events import Events

PERIOD = 7
OVERBOUGHT = 70
OVERSOLD = 30

class RSI:
    pubsub = None

    holding = False
    closes = []

    def __init__(self, pubsub):
        
        self.pubsub = pubsub

    async def predict(self, data):
        symbol = data['Symbol']
        kline = data['Kline']

        closed = kline['Closed']
        price = float(kline['Price'])

        if not closed:
            return

        print(f"Closed {closed} Price {price}")

        self.closes.append(price)

        if len(closes) > PERIOD:
            np_closes = numpy.array(self.closes)
            rsi = talib.RSI(np_closes, PERIOD)
            last = rsi[-1]

            print("Last RSI", last)

            if last > OVERBOUGHT:
                if self.holding:
                    payload = {
                        "Side": "SELL",
                        "Symbol": symbol,
                        "Price": price
                    }
                    self.pubsub.publish(Events.SignalTrade, payload)
                    self.holding = False # TODO: Remove hold if order succeeds
                else:
                    print("Rsi.Overbought.NoPosition")

            if last < OVERSOLD:
                if self.holding:
                    print("Rsi.Oversold.InPosition")
                else:
                    payload = {
                        "Side": "BUY",
                        "Symbol": symbol,
                        "Price": price
                    }
                    self.pubsub.publish(Events.SignalTrade, payload)
                    self.holding = True # TODO: trigger hold only if order succeeds
