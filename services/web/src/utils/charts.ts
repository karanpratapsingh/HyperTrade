import filter from 'lodash/filter';
import map from 'lodash/map';
import { Trade } from '../api/trades';
import { percent } from './math';

export type LineValue = Record<string, string | number | Date>;

export type TradeLinesData = [string, LineValue[]];

/**
 * TODO: fix trade line algorithm
 * 
 * ALl Symbols should be present for a given time period
 * { SYMBOL1, SYMBOL2, TIME }
 */
export function getTradeLinesData(trades: Trade[]): TradeLinesData[] {
  const symbols = new Set(map(trades, 'symbol'));

  const hashmap = new Map<Trade['symbol'], LineValue[]>();

  symbols.forEach(symbol => {
    const filtered = filter(trades, ['symbol', symbol]);
    const data: LineValue[] = map(
      filtered,
      ({ symbol, entry, exit, time }): LineValue => ({
        [symbol]: percent(exit - entry, entry).toFixed(2),
        time,
      })
    );

    hashmap.set(symbol, data);
  });

  return Array.from(hashmap.entries());
}
