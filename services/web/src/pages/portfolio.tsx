import { Divider, Layout } from 'antd';
import { useTrades } from '../api/trades';
import { StatsChart } from '../components/charts/stats';
import { TradesChart } from '../components/charts/trades';
import { BalanceTable } from '../components/tables/balance';
import { PositionsTable } from '../components/tables/positions';
import { TradesTable } from '../components/tables/trades';

const { Content } = Layout;

export function Portfolio(): React.ReactElement {
  const trades = useTrades();

  return (
    <Content className='flex p-6 bg-white'>
      <div className='flex flex-col' style={{ flex: 3 }}>
        <StatsChart {...trades} />
        <TradesChart {...trades} />
      </div>
      <Divider className='min-h-full mx-8' type='vertical' />
      <div
        className='flex flex-col h-full overflow-y-scroll'
        style={{ flex: 2 }}>
        <BalanceTable />
        <PositionsTable />
        <TradesTable {...trades} />
      </div>
    </Content>
  );
}
