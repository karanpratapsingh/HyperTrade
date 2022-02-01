import { Divider, Layout } from 'antd';
import { TradeChart } from '../components/charts/trade';
import { BalanceTable } from '../components/tables/balance';
import { PositionsTable } from '../components/tables/positions';
import { TradesTable } from '../components/tables/trades';

const { Content } = Layout;

export function Info(): React.ReactElement {
  return (
    <Content className='flex pl-6 pt-6 p-4 bg-white'>
      <div className='flex flex-col' style={{ flex: 2 }}>
        <BalanceTable />
        <PositionsTable />
        <TradesTable />
      </div>
      <Divider className='min-h-full mx-12' type='vertical' />
      <div className='flex flex-col' style={{ flex: 3 }}>
        <div className='flex flex-1'></div>
        <TradeChart />
      </div>
    </Content>
  );
}
