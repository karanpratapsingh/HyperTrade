import { Table } from 'antd';
import dateFormat from 'dateformat';
import { Position, usePositions } from '../api/positions';
import { Loader } from './loader';

export function PositionsList(): React.ReactElement {
  const { data, loading } = usePositions();

  if (!data || loading) {
    return <Loader />;
  }

  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time: Position['time']) => dateFormat(time, 'mmm dS hh:MM tt'),
    },
  ];

  return (
    <Table
      className='w-full text-xs font-light'
      pagination={{ pageSize: 4 }}
      columns={columns}
      dataSource={data?.positions}
    />
  );
}
