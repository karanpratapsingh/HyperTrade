import dateFormat from 'dateformat';
import { concat, map } from 'lodash';
import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTrades } from '../../api/trades';
import { Colors, LineColors } from '../../theme/colors';
import { Header } from '../ui/header';
import { Loader } from '../ui/loader';

export function TradeChart(): React.ReactElement {
  const { data, loading } = useTrades();

  if (!data || loading) {
    return <Loader />;
  }

  const tickStyle = {
    style: {
      color: Colors.gray,
      fontSize: 10,
      fontWeight: 300,
    },
  };

  const cartesianStyle = {
    stroke: Colors.lightGray,
  };

  const all = concat(map(data.trades, 'entry'), map(data.trades, 'exit'));

  const domain = [Math.min(...all) - 5, Math.max(...all) + 5];

  function timeFormatter(date: any): string {
    if ([0, 'auto'].includes(date)) {
      return date;
    }

    return dateFormat(date, 'HH:MM:ss');
  }

  const margin = {
    left: -10,
    bottom: 10,
  };

  const dotsConfig = {
    activeDot: { r: 8 },
    dot: { r: 0 },
  };

  return (
    <div className='flex flex-1 flex-col'>
      <Header title='Chart' subtitle='Trades line chart' />
      <LineChart
        className='mt-4'
        margin={margin}
        height={540}
        width={900}
        data={data?.trades}>
        <Legend />
        <CartesianGrid style={cartesianStyle} strokeDasharray='3' />
        <XAxis
          dy={5}
          dataKey='time'
          axisLine={false}
          tick={tickStyle}
          tickFormatter={timeFormatter}
        />
        <YAxis domain={domain} axisLine={false} tick={tickStyle} />
        <Tooltip labelFormatter={timeFormatter} />
        <Line
          type='monotone'
          dataKey='entry'
          stroke={LineColors.entry}
          {...dotsConfig}
        />
        <Line
          type='monotone'
          dataKey='exit'
          stroke={LineColors.exit}
          {...dotsConfig}
        />
      </LineChart>
    </div>
  );
}
