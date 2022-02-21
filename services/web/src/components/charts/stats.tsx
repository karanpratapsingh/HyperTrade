import { Empty, Statistic } from 'antd';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { Cell, Pie, PieChart } from 'recharts';
import { useStats } from '../../api/stats';
import { StatsColors } from '../../theme/colors';
import Env from '../../utils/env';
import { percent } from '../../utils/math';
import * as animated from '../ui/animated';
import { Header } from '../ui/header';
import { Loader } from '../ui/loader';

type PieData = {
  type: 'profit' | 'loss';
  value: number;
  percent: number;
};

const height = 200;
const width = 180;

export function StatsChart(): React.ReactElement {
  const { data, loading } = useStats(Env.SYMBOL);

  if (!data || loading) {
    return <Loader />;
  }

  let content: React.ReactNode = (
    <animated.Div
      className='flex flex-1 items-center justify-center'
      style={{ height, width }}>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </animated.Div>
  );

  if (data?.stats) {
    const { profit, loss, total } = data.stats;

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

    content = (
      <>
        <PieChart height={height} width={width}>
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
                precision={4}
                valueStyle={{ color: StatsColors[type] }}
                prefix={<BsCurrencyDollar />}
              />
            ))
          )}
        </div>
      </>
    );
  }

  return (
    <animated.Div className='flex flex-col'>
      <Header title='Portfolio' subtitle='Portfolio statistics' />
      <div className='flex items-center my-2'>{content}</div>
    </animated.Div>
  );
}
