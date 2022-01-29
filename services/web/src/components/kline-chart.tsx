import { Stock, StockConfig } from '@ant-design/plots';
import React from 'react';
import { Kline } from '../events';
import { useKline } from '../store/kline';
import dateFormat from 'dateformat';

export function KlineChart(): React.ReactElement {
  const data = useKline(state => state.data);

  const config: StockConfig = {
    data,
    xField: 'time',
    yField: ['open', 'close', 'high', 'low'],
    animation: false,
    xAxis: {
      label: {
        formatter: (text, item, index) => {
          const date = new Date(data[index].time);
          return dateFormat(date, 'mmm dS HH:MM:ss');
        },
      },
    },
  };

  return <Stock {...config} />;
}
