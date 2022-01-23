import json

import pandas as pd
import talib as ta
from utils.log import Logger


class Strategy:
    df = pd.DataFrame()

    def populate(self, data):
        kline = data['kline']

        # TODO: should we only run prediction for closed kline?
        # final = kline['final']
        # if not final:
        #     return

        self.df = self.df.append(kline, ignore_index=True)
        self.add_indicators()
        self.buy_trend()
        self.sell_trend()
        self.set_datatypes()

    def set_datatypes(self):
        types = {
            "time": int,
            'open': float,
            'high': float,
            'low': float,
            'close': float,
            'volume': float,
            'final': bool,
            'adx': float,
            'rsi': float,
            'macd': float,
            'macd_signal': float,
            'macd_hist': float,
            'buy': bool,
            'sell': bool,
        }

        self.df = self.df.astype(types)

    def get_payload(self):
        index = self.last_index()
        data = json.loads(self.df.loc[index].to_json())

        payload = {
            'kline': {
                'symbol': data['symbol'],
                'time': data['time'],
                'open': data['open'],
                'high': data['high'],
                'low': data['low'],
                'close': data['close'],
                'volume': data['volume'],
                'final': data['final']
            },
            'indicators': {
                'adx': data['adx'],
                'rsi': data['rsi'],
                'macd': data['macd'],
                'macd_signal': data['macd_signal'],
                'macd_hist': data['macd_hist']
            },
            'signal': {
                'buy': data['buy'],
                'sell': data['sell']
            }
        }

        return payload

    def add_indicators(self):
        frame = self.df

        adx = ta.ADX(frame.high, frame.low, frame.close, timeperiod=14)
        frame['adx'] = adx

        rsi = ta.RSI(frame.close)
        frame['rsi'] = rsi

        macd, macd_signal, macd_hist = ta.MACD(
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
            self.df.loc[index, 'sell'] = True
        else:
            self.df.loc[index, 'sell'] = False

    def last_index(self) -> int:
        return self.df.index[-1]
