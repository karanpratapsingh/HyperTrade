import dateFormat from 'dateformat';
import map from 'lodash/map';
import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { DataFrameEventPayload, Indicators } from '../../events/types';
import { useDataFrame } from '../../store/dataframe';
import { Colors, LineColors } from '../../theme/colors';

interface IndicatorChartProps {
  types: (keyof Indicators)[];
}

export function IndicatorChart(props: IndicatorChartProps): React.ReactElement {
  const { types } = props;

  const data = useDataFrame(state => state.data);
  const indicators = map<DataFrameEventPayload>(
    data,
    ({ indicators, kline: { time } }: DataFrameEventPayload) => ({
      ...indicators,
      time,
    })
  );

  let domain: number[] | undefined;

  if (types.includes('rsi')) {
    domain = [0, 100];
  }

  function timeFormatter(date: any): string {
    if (['auto', 0].includes(date)) {
      return date;
    }

    return dateFormat(date, 'HH:MM:ss');
  }

  const tickStyle = {
    style: {
      color: Colors.grey,
      fontSize: 10,
      fontWeight: 300,
    },
  };

  const cartesianStyle = {
    stroke: Colors.lightGrey,
  };

  return (
    <LineChart
      margin={{ left: -30, bottom: 10 }}
      height={325}
      width={550}
      data={indicators}>
      <Legend />
      <CartesianGrid style={cartesianStyle} strokeDasharray='3' />
      <XAxis
        dy={5}
        dataKey='time'
        axisLine={false}
        tick={tickStyle}
        tickFormatter={timeFormatter}
      />
      <YAxis axisLine={false} domain={domain} tick={tickStyle} />
      <Tooltip labelFormatter={timeFormatter} />
      {types.map(type => (
        <Line
          type='monotone'
          dataKey={type}
          stroke={LineColors[type]}
          activeDot={{ r: 8 }}
          dot={{ r: 0 }}
        />
      ))}
    </LineChart>
  );
}
