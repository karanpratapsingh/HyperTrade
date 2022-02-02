import { Chart, dispose, init, KLineData } from 'klinecharts';
import { difference, map } from 'lodash';
import React, { useEffect } from 'react';
import { Indicators, TechnicalIndicators } from '../../config/indicators';
import { useDataFrame } from '../../store/dataframe';

const CHART_ID = 'kline-chart';

export enum ChartType {
  CANDLE = 'candle_solid',
  AREA = 'area',
}

interface KlineChartProps {
  type: ChartType;
  primary: TechnicalIndicators[];
  secondary: TechnicalIndicators[];
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

export function KlineChart(props: KlineChartProps): React.ReactElement {
  const { type, primary, secondary } = props;

  const [chart, setChart] = React.useState<Chart | null>(null);

  useEffect(() => {
    const chart = init(CHART_ID, options);

    const unsubscribe = useDataFrame.subscribe(({ data }): void => {
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

  return <div id={CHART_ID} className='w-full' style={{ height: '90%' }} />;
}
