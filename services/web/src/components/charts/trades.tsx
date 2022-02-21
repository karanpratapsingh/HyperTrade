import { Empty } from 'antd';
import dateFormat from 'dateformat';
import concat from 'lodash/concat';
import map from 'lodash/map';
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
import { TradesResponse } from '../../api/trades';
import { ApiQueryResult } from '../../api/types';
import { Colors, LineColors } from '../../theme/colors';
import * as animated from '../ui/animated';
import { Header } from '../ui/header';
import { Loader } from '../ui/loader';

interface TradesChartProps extends ApiQueryResult<TradesResponse> {}

export function TradesChart(props: TradesChartProps): React.ReactElement {
  const { data, loading } = props;

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

  function timeFormatter(date: string): string {
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

  let content: React.ReactNode = (
    <div className='flex flex-1 items-center justify-center'>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </div>
  );

  const { trades } = data;

  if (trades.length) {
    content = (
      <LineChart margin={margin} data={trades} height={540} width={940}>
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
    );
  }

  return (
    <animated.Div className='flex flex-1 flex-col'>
      <Header title='Chart' subtitle='Trades line chart' />
      {content}
    </animated.Div>
  );
}
