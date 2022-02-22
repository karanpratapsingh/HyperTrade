import { Layout, Table, Tag } from 'antd';
import dateFormat from 'dateformat';
import reverse from 'lodash/reverse';
import * as animated from '../components/ui/animated';
import { Header } from '../components/ui/header';
import { Loader } from '../components/ui/loader';
import { Kline, Signal } from '../events/types';
import { useDataFrame } from '../store/dataframe';
import { FinalTagColors, SignalTagColors } from '../theme/colors';
import { paginationProps } from '../utils/pagination';

const { Content } = Layout;
const { Column, ColumnGroup } = Table;

export function DataFrame(): React.ReactElement {
  const [dataframe, loading] = useDataFrame(state => [
    state.data,
    state.loading,
  ]);

  function renderTime(time: Kline['time']): React.ReactNode {
    return dateFormat(time, 'mmm dS hh:MM:ss tt');
  }

  function renderFinal(final: Kline['final']): React.ReactNode {
    const text = final ? 'Yes' : 'No';

    return <Tag color={FinalTagColors[text]}>{text}</Tag>;
  }

  function renderIndicators(indicator: number): React.ReactNode {
    return indicator || '-';
  }

  function renderSignal(signal: Signal): React.ReactNode {
    return <Tag color={SignalTagColors[signal]}>{signal}</Tag>;
  }

  let content: React.ReactNode = <Loader />;

  if (!loading) {
    content = (
      <animated.Div>
        <Table
          className='text-xs font-light'
          dataSource={reverse(dataframe)}
          pagination={paginationProps(dataframe.length, 11)}>
          <ColumnGroup title='Kline' key='kline'>
            <Column
              title='Time'
              dataIndex={['kline', 'time']}
              key='time'
              render={renderTime}
            />
            <Column title='Open' dataIndex={['kline', 'open']} key='open' />
            <Column title='High' dataIndex={['kline', 'high']} key='high' />
            <Column title='Low' dataIndex={['kline', 'low']} key='low' />
            <Column title='Close' dataIndex={['kline', 'close']} key='close' />
            <Column
              title='Volume'
              dataIndex={['kline', 'volume']}
              key='volume'
            />
            <Column
              title='Final'
              dataIndex={['kline', 'final']}
              key='final'
              render={renderFinal}
            />
          </ColumnGroup>
          <ColumnGroup title='Indicators' key='indicators'>
            <Column
              title='ADX'
              dataIndex={['indicators', 'adx']}
              key='adx'
              render={renderIndicators}
            />
            <Column
              title='RSI'
              dataIndex={['indicators', 'rsi']}
              key='rsi'
              render={renderIndicators}
            />
            <Column
              title='MACD'
              dataIndex={['indicators', 'macd']}
              key='macd'
              render={renderIndicators}
            />
            <Column
              title='MACD Signal'
              dataIndex={['indicators', 'macd_signal']}
              key='macd_signal'
              render={renderIndicators}
            />
            <Column
              title='MACD Hist'
              dataIndex={['indicators', 'macd_hist']}
              key='macd_hist'
              render={renderIndicators}
            />
          </ColumnGroup>
          <Column
            title='Signal'
            dataIndex={'signal'}
            key='signal'
            render={renderSignal}
          />
        </Table>
      </animated.Div>
    );
  }

  return (
    <Content className='p-6 bg-white flex flex-col'>
      <Header title='Dataframe' subtitle='Live data frames' />
      {content}
    </Content>
  );
}
