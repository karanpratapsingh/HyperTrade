import { Table } from 'antd';
import dateFormat from 'dateformat';
import { Trade, useTrades } from '../api/trades';
import { Loader } from './loader';

export function TradesList(): React.ReactElement {
  const { data, loading } = useTrades();

  if (!data || loading) {
    return <Loader />;
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Entry',
      dataIndex: 'entry',
      key: 'entry',
    },
    {
      title: 'Exit',
      dataIndex: 'exit',
      key: 'exit',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time: Trade['time']) => dateFormat(time, 'mmm dS hh:MM tt'),
    },
  ];

  return (
    <Table
      className='w-full text-xs font-light'
      pagination={{ pageSize: 4 }}
      columns={columns}
      dataSource={data?.trades}
    />
  );
}
