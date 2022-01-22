import pandas as pd
import talib


class Strategy:
    df = pd.DataFrame()

    def populate(self, data):
        kline = data['Kline']

        # TODO: should we only run prediction for closed klines?
        # final = kline['Final']
        # if not final:
        #     return

        update = {
            'time': kline['Time'],
            'open': kline['Open'],
            'high': kline['High'],
            'low': kline['Low'],
            'close': kline['Close'],
            'volume': kline['Volume']
        }

        self.df = self.df.append(update, ignore_index=True)
        self.add_indicators()
        self.buy_trend()
        self.sell_trend()

    def print(self):
        print(self.df)

    def add_indicators(self):
        frame = self.df

        adx = talib.ADX(frame.high, frame.low, frame.close, timeperiod=14)
        frame['adx'] = adx

        rsi = talib.RSI(frame.close)
        frame['rsi'] = rsi

        macd, macd_signal, macd_hist = talib.MACD(
            frame.close, fastperiod=12, slowperiod=26, signalperiod=9)
        frame['macd'] = macd
        frame['macd_signal'] = macd_signal
        frame['macd_hist'] = macd_hist

        self.df = frame

    def get_buy_condition(self, index):
        rsi = self.df['rsi'][index]
        condition = rsi <= 40

        return condition

    def buy_trend(self):
        index = self.last_index()
        condition = self.get_buy_condition(index)

        if condition:
            self.df.loc[index, 'buy'] = True
        else:
            self.df.loc[index, 'buy'] = False

    def get_sell_condition(self, index):
        rsi = self.df['rsi'][index]
        condition = rsi >= 60

        return condition

    def sell_trend(self):
        index = self.last_index()
        condition = self.get_sell_condition(index)

        if condition:
            # TODO: buy condition needs to be sync
            self.df.loc[index, 'sell'] = True
        else:
            self.df.loc[index, 'sell'] = False

    def last_index(self) -> int:
        return self.df.index[-1]
