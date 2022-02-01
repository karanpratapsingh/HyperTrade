import { Table } from 'antd';
import dateFormat from 'dateformat';
import { Trade, useTrades } from '../../api/trades';
import { Loader } from '../ui/loader';
import { Header } from '../ui/header';

export function TradesTable(): React.ReactElement {
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
    <div className='mt-4 w-full flex flex-col'>
      <Header title='Trades' subtitle='Trades executed so far' />
      <Table
        className='mt-4 text-xs font-light'
        pagination={{ pageSize: 4 }}
        columns={columns}
        dataSource={data.trades}
      />
    </div>
  );
}
