import { Table } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { Balance, useBalance } from '../../api/balance';
import { Icons } from '../../theme/icons';
import { paginationProps } from '../../utils/pagination';
import * as animated from '../ui/animated';
import { Header } from '../ui/header';
import { Loader } from '../ui/loader';

export function BalanceTable(): React.ReactElement {
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
      render: (amount: Balance['amount']) => <span>{amount.toFixed(4)}</span>,
    },
  ];

  return (
    <animated.Div className='w-full flex flex-1 flex-col table'>
      <Header title='Balance' subtitle='Current balance' />
      <Table
        className='mt-4 text-xs font-light'
        columns={columns}
        pagination={paginationProps(data.balance.length)}
        dataSource={data.balance}
      />
    </animated.Div>
  );
}
