import { Table } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { Balance, useBalance } from '../api/balance';
import { Icons } from '../theme/icons';
import { Loader } from './loader';
import { Header } from './ui/header';

export function BalanceList(): React.ReactElement {
  const { data, loading } = useBalance();

  if (!data || loading) {
    return <Loader />;
  }

  const columns = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
      render: (asset: Balance['asset']) => (
        <div className='flex items-center'>
          <Avatar src={Icons[asset.toLowerCase()]} />
          <span className='ml-4'>{asset}</span>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  return (
    <div className='w-full flex flex-col'>
      <Header title='Balance' subtitle='Current balance' />
      <Table
        className='mt-4 text-xs font-light'
        columns={columns}
        pagination={false}
        dataSource={data?.balance}
      />
    </div>
  );
}
