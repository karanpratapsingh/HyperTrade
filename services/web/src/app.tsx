import 'antd/dist/antd.css';
import './styles/app.css';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from './components/error-boundary';
import { KlineChart } from './components/kline-chart';
import { DataFrameEvent, DataFrameEventPayload } from './events';
import { useKline } from './store/kline';
import { PubSub } from './utils/pubsub';

function App(): React.ReactElement {
  const { add } = useKline();
  async function init() {
    const pubsub = new PubSub();
    await pubsub.init();

    pubsub.subscribe<DataFrameEventPayload>(DataFrameEvent, payload => {
      add(payload.kline);
    });
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className='h-full p-16'>
      <KlineChart />
    </div>
  );
}

ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);
