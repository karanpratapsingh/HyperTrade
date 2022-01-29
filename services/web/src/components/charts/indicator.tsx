import { Line, LineConfig } from '@ant-design/plots';
import dateFormat from 'dateformat';
import map from 'lodash/map';
import React from 'react';
import { DataFrameEventPayload, Indicators } from '../../events';
import { useDataFrame } from '../../store/dataframe';

interface IndicatorChartProps {
  types: (keyof Indicators)[];
}

type Line = {
  type: keyof Indicators;
  value: number;
  interval: number;
};

export function IndicatorChart(props: IndicatorChartProps): React.ReactElement {
  const data = useDataFrame(state => state.data);
  const indicators: Indicators[] = map<DataFrameEventPayload>(
    data,
    'indicators'
  );

  const lines = indicators.map((indicator, interval) => {
    const array: Line[] = [];

    props.types.forEach(type => {
      const value = indicator[type];
      if (value) {
        array.push({ type, value: parseFloat(value.toFixed(2)), interval });
      }
    });

    return array;
  });

  const config: LineConfig = {
    data: lines.flat(),
    xField: 'interval',
    yField: 'value',
    seriesField: 'type',
    xAxis: {
      label: {
        formatter: (text, item, index) => {
          const date = new Date(data[index].kline.time);
          return dateFormat(date, 'HH:MM:ss');
        },
      },
    },
    tooltip: {
      title: 'Indicators',
    },
    legend: {
      position: 'top',
    },
    smooth: true,
  };

  return <Line {...config} />;
}
