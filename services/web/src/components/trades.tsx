import { List } from 'antd';
import { Trade, useTrades } from '../api/trades';
import { Loader } from './loader';
import dateFormat from 'dateformat';

export function TradesList(): React.ReactElement {
  const { data, loading } = useTrades();

  if (!data || loading) {
    return <Loader />;
  }

  function renderItem(item: Trade): React.ReactNode {
    return (
      <List.Item>
        <span className='font-bold'>{item.id}</span>
        <span className='font-bold'>{item.symbol}</span>
        <span className='font-bold'>{item.entry}</span>
        <span className='font-bold'>{item.exit}</span>
        <span className='font-bold'>{item.quantity}</span>
        <span className='font-bold'>{dateFormat(item.time, 'HH:MM:ss')}</span>
      </List.Item>
    );
  }

  return (
    <List
      header={<span className='text-xl font-bold'>Trades</span>}
      style={{ width: '100%' }}
      dataSource={data?.trades}
      renderItem={renderItem}
    />
  );
}
