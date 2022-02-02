import { Statistic } from 'antd';
import { upperFirst } from 'lodash';
import React from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { Cell, Pie, PieChart } from 'recharts';
import { Trade, TradesResponse } from '../../api/trades';
import { ApiHookResult } from '../../api/types';
import { StatsColors } from '../../theme/colors';
import { Header } from '../ui/header';
import { Loader } from '../ui/loader';

const ALLOWED = 12; // TODO: fetch this from exchange service

type Stats = {
  profit: number;
  loss: number;
  total: number;
};

type PieData = {
  type: 'profit' | 'loss';
  value: number;
  percent: number;
};

interface StatsChartProps extends ApiHookResult<TradesResponse> {}

export function StatsChart(props: StatsChartProps): React.ReactElement {
  const { data, loading } = props;

  if (!data || loading) {
    return <Loader />;
  }

  const { profit, loss, total } = calculateStats(data.trades);

  const pie: PieData[] = [
    {
      type: 'profit',
      value: profit,
      percent: percent(profit, total),
    },
    {
      type: 'loss',
      value: loss,
      percent: percent(loss, total),
    },
  ];

  return (
    <div className='flex flex-col'>
      <Header title='Portfolio' subtitle='Portfolio statistics' />
      <div className='flex items-center my-2'>
        <PieChart height={200} width={180}>
          <Pie
            data={pie}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey='percent'>
            {React.Children.toArray(
              pie.map(({ type }) => (
                <Cell key={type} fill={StatsColors[type]} />
              ))
            )}
          </Pie>
        </PieChart>
        <div className='flex flex-col ml-6'>
          {React.Children.toArray(
            pie.map(({ type, value }) => (
              <Statistic
                className='mb-2'
                title={upperFirst(type)}
                value={value}
                precision={2}
                valueStyle={{ color: StatsColors[type] }}
                prefix={<BsCurrencyDollar />}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function calculateStats(trades: Trade[]): Stats {
  const amounts = trades.map(({ entry, exit }) => {
    const percentage = ((exit - entry) / entry) * 100;
    const value = percentage * ALLOWED;
    return value;
  });

  let loss = 0;
  let profit = 0;

  for (const amount of amounts) {
    if (amount < 0) {
      loss += amount * -1;
    }

    if (amount > 0) {
      profit += amount;
    }
  }

  const total = loss + profit;

  return {
    loss,
    profit,
    total,
  };
}

function percent(value: number, total: number): number {
  return (value / total) * 100;
}
