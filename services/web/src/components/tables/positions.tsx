import { Table } from 'antd';
import dateFormat from 'dateformat';
import { Position, usePositions } from '../../api/positions';
import { paginationProps } from '../../utils/pagination';
import { Header } from '../ui/header';
import { Loader } from '../ui/loader';

export function PositionsTable(): React.ReactElement {
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
    <div className='mt-4 w-full flex flex-1 flex-col table'>
      <Header title='Positions' subtitle='Positions currently holding' />
      <Table
        className='mt-4 text-xs font-light'
        columns={columns}
        pagination={paginationProps(data.positions.length)}
        dataSource={data.positions}
      />
    </div>
  );
}
