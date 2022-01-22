import talib
import numpy
from utils.pubsub import PubSub
from utils.events import Events
from utils.log import Logger

PERIOD = 14
OVERBOUGHT = 70
OVERSOLD = 30


class RSI:
    pubsub = None

    holding = False
    closes = []

    log = Logger.get('RSI')

    def __init__(self, pubsub):
        self.log.info(
            f'Strategy.Rsi.Init overbought={OVERBOUGHT} oversold={OVERSOLD}')
        self.pubsub = pubsub

    async def predict(self, data):
        symbol = data['Symbol']
        kline = data['Kline']

        closed = kline['Closed']
        price = float(kline['Price'])

        if not closed:
            return

        self.closes.append(price)

        total_closes = len(self.closes)

        if total_closes > PERIOD:
            np_closes = numpy.array(self.closes)
            rsi = talib.RSI(np_closes, PERIOD)
            last_rsi = rsi[-1]

            self.log.debug(
                f'Rsi symbol={symbol} price={price} last_rsi={last_rsi}')

            if last_rsi > OVERBOUGHT:
                if self.holding:
                    payload = {
                        'Side': 'SELL',
                        'Symbol': symbol,
                        'Price': price
                    }
                    self.pubsub.publish(Events.SignalTrade, payload)
                    self.holding = False  # TODO: Remove hold if order succeeds
                else:
                    self.log.warn('Rsi.Overbought.NoPosition')

            if last_rsi < OVERSOLD:
                if self.holding:
                    self.log.warn('Rsi.Oversold.InPosition')
                else:
                    payload = {
                        'Side': 'BUY',
                        'Symbol': symbol,
                        'Price': price
                    }
                    self.pubsub.publish(Events.SignalTrade, payload)
                    self.holding = True  # TODO: trigger hold only if order succeeds
