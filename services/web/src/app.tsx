import 'antd/dist/antd.css';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BalanceList } from './components/balance';
import { IndicatorChart } from './components/charts/indicator';
import { KlineChart } from './components/charts/kline';
import { ErrorBoundary } from './components/error-boundary';
import { TradesList } from './components/trades';
import { DataFrameEvent, DataFrameEventPayload } from './events';
import { useDataFrame } from './store/dataframe';
import './styles/app.css';
import { PubSub } from './utils/pubsub';

const client = new QueryClient();

function App(): React.ReactElement {
  const add = useDataFrame(state => state.add);

  async function init() {
    const pubsub = new PubSub();
    await pubsub.init();

    pubsub.subscribe<DataFrameEventPayload>(DataFrameEvent, payload => {
      add(payload);
    });
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className='h-full p-16 flex flex-1'>
      <div className='flex flex-col mr-8' style={{ flex: 3 }}>
        <div>
          <KlineChart />
        </div>
        <div className='flex items-center justify-between mt-4'>
          <IndicatorChart types={['rsi', 'adx']} />
          <IndicatorChart types={['macd']} />
          <IndicatorChart types={['macd_hist', 'macd_signal']} />
        </div>
      </div>
      <div className='flex flex-1 flex-col'>
        <div className='flex flex-1'>
          <BalanceList />
        </div>
        <div className='flex flex-1'>
          <TradesList />
        </div>
        <div className='flex flex-1'>Positions</div>
      </div>
    </div>
  );
}

ReactDOM.render(
  <QueryClientProvider client={client}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </QueryClientProvider>,
  document.getElementById('root')
);
