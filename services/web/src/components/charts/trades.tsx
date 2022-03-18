import { Empty } from 'antd';
import dateFormat from 'dateformat';
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
import uniqolor from 'uniqolor';
import { GetTradesResponse } from '../../api/trades';
import { ApiQueryResult } from '../../api/types';
import { Colors } from '../../theme/colors';
import { getTradeLinesData, TradeLinesData } from '../../utils/charts';
import * as animated from '../ui/animated';
import { Header } from '../ui/header';
import { Loader } from '../ui/loader';

interface TradesChartProps extends ApiQueryResult<GetTradesResponse> {}

export function TradesChart(props: TradesChartProps): React.ReactElement {
  const { data, loading } = props;

  if (!data || loading) {
    return <Loader />;
  }

  const tickStyle = {
    style: {
      color: Colors.darkGray,
      fontSize: 10,
      fontWeight: 300,
    },
  };

  const cartesianStyle = {
    stroke: Colors.lightGray,
  };

  const domain = [-100, 100];

  function timeFormatter(date: string): string {
    if ([0, 'auto'].includes(date)) {
      return date;
    }

    return dateFormat(date, 'HH:MM:ss');
  }

  function percentFormatter(value: string): string {
    return `${value}%`;
  }

  function renderLine([symbol, data]: TradeLinesData) {
    const { color } = uniqolor(symbol, {
      lightness: 40,
      saturation: 80,
    });

    return (
      <Line
        type='monotone'
        data={data}
        dataKey={symbol}
        stroke={color}
        {...dotsConfig}
      />
    );
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
    const data = getTradeLinesData(trades);

    content = (
      <LineChart margin={margin} height={540} width={940}>
        <Legend />
        <CartesianGrid style={cartesianStyle} strokeDasharray='3' />
        <XAxis
          dy={5}
          dataKey='time'
          axisLine={false}
          tick={tickStyle}
          tickFormatter={timeFormatter}
        />
        <YAxis
          domain={domain}
          axisLine={false}
          tick={tickStyle}
          tickFormatter={percentFormatter}
        />
        <Tooltip labelFormatter={timeFormatter} />
        {React.Children.toArray(data.map(renderLine))}
      </LineChart>
    );
  }

  return (
    <animated.Div className='flex flex-col' style={{ flex: 3 }}>
      <Header title='Chart' subtitle='Trades line chart' />
      {content}
    </animated.Div>
  );
}
