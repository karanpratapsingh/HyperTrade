import { Avatar, List } from 'antd';
import { Balance, useBalance } from '../api/balance';
import { Loader } from './loader';

export function BalanceList(): React.ReactElement {
  const { data, loading } = useBalance();

  if (!data || loading) {
    return <Loader />;
  }

  function renderItem(item: Balance): React.ReactNode {
    const src = `https://cryptoicons.org/api/icon/${item.asset.toLocaleLowerCase()}/100`;

    return (
      <List.Item>
        <Avatar src={src} />
        <span className='font-bold'>{item.asset}</span>
        <span className='font-bold'>{item.amount}</span>
      </List.Item>
    );
  }

  return (
    <List
      header={<span className='text-xl font-bold'>Balance</span>}
      style={{ width: '100%' }}
      dataSource={data?.balance}
      renderItem={renderItem}
    />
  );
}
