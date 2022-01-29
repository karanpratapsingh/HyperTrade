import { Stock, StockConfig } from '@ant-design/plots';
import dateFormat from 'dateformat';
import map from 'lodash/map';
import React from 'react';
import { DataFrameEventPayload, Kline } from '../../events';
import { useDataFrame } from '../../store/dataframe';

export function KlineChart(): React.ReactElement {
  const data = useDataFrame(state => state.data);

  const kline: Kline[] = map<DataFrameEventPayload>(data, 'kline');

  const config: StockConfig = {
    data: kline,
    xField: 'time',
    yField: ['open', 'close', 'high', 'low'],
    autoFit: false,
    animation: false,
    yAxis: {
      label: {
        formatter: text => {
          const label = Number.parseFloat(text);
          return label.toFixed(2);
        },
      },
    },
    xAxis: {
      label: {
        formatter: (text, item, index) => {
          const date = new Date(kline[index].time);
          return dateFormat(date, 'HH:MM:ss');
        },
      },
    },
  };

  return <Stock {...config} />;
}
