import { Layout } from 'antd';
import { BalanceTable } from '../components/tables/balance';
import { PositionsTable } from '../components/tables/positions';
import { TradesTable } from '../components/tables/trades';

const { Content } = Layout;

export function Info(): React.ReactElement {
  return (
    <Content className='flex pl-6 pt-6 p-4 bg-white'>
      <div className='flex mr-4' style={{ flex: 3 }}>
        <div className='flex flex-1'>
          <TradesTable />
        </div>
        <div className='flex flex-1'></div>
      </div>
      <div className='flex flex-col' style={{ flex: 2 }}>
        <BalanceTable />
        <PositionsTable />
        <TradesTable />
      </div>
    </Content>
  );
}
