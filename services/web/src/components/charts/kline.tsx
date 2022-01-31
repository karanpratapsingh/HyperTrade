import {
  Chart,
  dispose,
  init,
  KLineData,
  TechnicalIndicator
} from 'klinecharts';
import { difference, map } from 'lodash';
import React, { useEffect } from 'react';
import { useDataFrame } from '../../store/dataframe';

const CHART_ID = 'kline-chart';

export enum TechnicalIndicators {
  RSI = 'RSI',
  MACD = 'MACD',
  VOL = 'VOL',

  MA = 'MA',
  EMA = 'EMA',
  SMA = 'SMA',

  BOLL = 'BOLL',
  SAR = 'SAR',
  BBI = 'BBI',

  KDJ = 'KDJ',
  OBV = 'OBV',
}

export enum ChartType {
  CANDLE = 'candle_solid',
  AREA = 'area',
}

interface KlineChartProps {
  type: ChartType;
  main: TechnicalIndicators[];
  sub: TechnicalIndicators[];
}

const options = {
  candle: {
    tooltip: {
      labels: ['T: ', 'O: ', 'C: ', 'H: ', 'O: ', 'V: '],
    },
  },
  technicalIndicator: {
    lastValueMark: {
      show: true,
      text: {
        show: true,
      },
    },
  },
};

const indicatorConfig: Record<TechnicalIndicators, TechnicalIndicator> = {
  [TechnicalIndicators.RSI]: { name: 'RSI', calcParams: [14] },
  [TechnicalIndicators.MACD]: { name: 'MACD' },
  [TechnicalIndicators.VOL]: { name: 'VOL' },

  [TechnicalIndicators.MA]: { name: 'MA' },
  [TechnicalIndicators.EMA]: { name: 'EMA' },
  [TechnicalIndicators.SMA]: { name: 'SMA' },

  [TechnicalIndicators.BOLL]: { name: 'BOLL' },
  [TechnicalIndicators.SAR]: { name: 'SAR' },
  [TechnicalIndicators.BBI]: { name: 'BBI' },

  [TechnicalIndicators.KDJ]: { name: 'KDJ' },
  [TechnicalIndicators.OBV]: { name: 'OBV' },
};

export function KlineChart(props: KlineChartProps): React.ReactElement {
  const { type, main, sub } = props;

  const [chart, setChart] = React.useState<Chart | null>(null);

  useEffect(() => {
    const chart = init(CHART_ID, options);

    const unsubscribe = useDataFrame.subscribe(({ data }) => {
      const klineData: KLineData[] = map(
        data,
        ({ kline: { open, close, high, low, volume, time } }) => ({
          open,
          close,
          high,
          low,
          volume,
          timestamp: time,
        })
      );
      chart?.applyNewData(klineData);
    });

    setChart(chart);

    return () => {
      dispose(CHART_ID);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const options = {
      candle: {
        type,
      },
    };

    chart?.setStyleOptions(options);
  }, [chart, type]);

  useEffect(() => {
    const getSubId = (type: string) => `sub-${type}`;
    const getMainId = () => 'candle_pane';

    setIndicators(main, true, getMainId);
    setIndicators(sub, false, getSubId);
  }, [chart, main, sub]);

  function setIndicators(
    indicators: TechnicalIndicators[],
    stack: boolean,
    getId: (type: string) => string
  ): void {
    const all = Object.keys(TechnicalIndicators);
    const diff = difference(all, indicators);

    diff.forEach(type => {
      chart?.removeTechnicalIndicator(getId(type));
    });

    indicators.forEach(type => {
      chart?.createTechnicalIndicator(indicatorConfig[type], stack, {
        id: getId(type),
      });
    });
  }

  return <div id={CHART_ID} style={{ height: '90%', width: '100%' }}></div>;
}
