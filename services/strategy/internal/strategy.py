import json

import pandas as pd
import talib as ta
from utils.log import Logger
from internal.events import Signal


class Strategy:
    df = pd.DataFrame()
    strategy = None

    def populate(self, data):
        kline = data['kline']

        self.strategy = data['strategy']

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

        buy = data['buy']
        sell = data['sell']

        signal = Signal.NONE

        if buy and not sell:
            signal = Signal.BUY
        elif sell and not buy:
            signal = Signal.SELL

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
            'signal': signal
        }

        return payload

    def add_indicators(self):
        frame = self.df

        rsi_config = self.strategy['rsi']
        macd_config = self.strategy['macd']

        adx = ta.ADX(frame.high, frame.low, frame.close, timeperiod=14)
        frame['adx'] = adx

        rsi = ta.RSI(frame.close, timeperiod=rsi_config['period'])
        frame['rsi'] = rsi

        macd, macd_signal, macd_hist = ta.MACD(
            frame.close,
            fastperiod=macd_config['fast'],
            slowperiod=macd_config['slow'],
            signalperiod=macd_config['signal']
        )

        frame['macd'] = macd
        frame['macd_signal'] = macd_signal
        frame['macd_hist'] = macd_hist

        self.df = frame

    def get_buy_condition(self, index) -> bool:
        condition = False

        if self.strategy is None:
            return condition

        rsi = self.df['rsi'][index]
        rsi_config = self.strategy['rsi']

        if rsi_config['enabled']:
            condition = rsi <= rsi_config['oversold']

        return condition

    def buy_trend(self):
        index = self.last_index()
        condition = self.get_buy_condition(index)

        if condition:
            self.df.loc[index, 'buy'] = True
        else:
            self.df.loc[index, 'buy'] = False

    def get_sell_condition(self, index) -> bool:
        condition = False

        if self.strategy is None:
            return condition

        rsi = self.df['rsi'][index]
        rsi_config = self.strategy['rsi']

        if rsi_config['enabled']:
            condition = rsi >= rsi_config['overbought']

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
