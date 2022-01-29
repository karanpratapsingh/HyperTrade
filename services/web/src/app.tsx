import 'antd/dist/antd.css';
import './styles/app.css';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from './components/error-boundary';
import { KlineChart } from './components/charts/kline';
import { DataFrameEvent, DataFrameEventPayload } from './events';
import { useDataFrame } from './store/dataframe';
import { PubSub } from './utils/pubsub';
import { IndicatorChart } from './components/charts/indicator';

function App(): React.ReactElement {
  const { add } = useDataFrame();
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
      <div className='flex flex-col mr-4' style={{ flex: 3 }}>
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
        <div className='flex flex-1'>Balance</div>
        <div className='flex flex-1'>Trades</div>
        <div className='flex flex-1'>Positions</div>
      </div>
    </div>
  );
}

ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);
