import { Chart, dispose, init, KLineData } from 'klinecharts';
import difference from 'lodash/difference';
import map from 'lodash/map';
import React, { useEffect, useState } from 'react';
import { Indicators, TechnicalIndicators } from '../../config/indicators';
import { useDataFrameStore } from '../../store/dataframe';
import { useSymbolStore } from '../../store/symbol';
import * as animated from '../ui/animated';
import { Loader } from '../ui/loader';

const CHART_ID = 'kline-chart';

export enum ChartType {
  CANDLE = 'candle_solid',
  AREA = 'area',
}

export enum AxisType {
  NORMAL = 'normal',
  PERCENTAGE = 'percentage',
}

interface KlineChartProps {
  type: ChartType;
  axis: AxisType;
  primary: TechnicalIndicators[];
  secondary: TechnicalIndicators[];
}

const options = {
  candle: {
    tooltip: {
      labels: ['T: ', 'O: ', 'C: ', 'H: ', 'L: ', 'V: '],
    },
  },
  yAxis: {
    type: 'percentage',
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

export function KlineChart(props: KlineChartProps): React.ReactElement {
  const { type, axis, primary, secondary } = props;

  const { getSymbol } = useSymbolStore();
  const loading = useDataFrameStore(state => state.loading);
  const [chart, setChart] = useState<Chart | null>(null);

  useEffect(() => {
    const chart = init(CHART_ID, options);

    const unsubscribe = useDataFrameStore.subscribe(({ get }): void => {
      const symbol = getSymbol();
      const data = get(symbol);

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
    const options = {
      yAxis: {
        type: axis,
      },
    };

    chart?.setStyleOptions(options);
  }, [chart, axis]);

  useEffect(() => {
    const getSubId = (type: string) => `sub-${type}`;
    const getMainId = () => 'candle_pane';

    setIndicators(primary, true, getMainId);
    setIndicators(secondary, false, getSubId);
  }, [chart, primary, secondary]);

  function setIndicators(
    indicators: TechnicalIndicators[],
    stack: boolean,
    getId: (type: string) => string
  ): void {
    const all = Object.keys(Indicators);
    const diff = difference(all, map(indicators, 'name'));

    diff.forEach(name => {
      chart?.removeTechnicalIndicator(getId(name));
    });

    indicators.forEach(indicator => {
      chart?.createTechnicalIndicator(indicator, stack, {
        id: getId(indicator.name),
      });
    });
  }

  return (
    <>
      <animated.Div
        id={CHART_ID}
        className='w-full'
        style={{ height: '92%' }}
      />
      <Loader className='absolute top-0 left-0' visible={loading} />
    </>
  );
}
