import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BiBarChart } from 'react-icons/bi';
import { RiDonutChartFill } from 'react-icons/ri';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ErrorBoundary } from './components/error-boundary';
import { PubSub } from './events/pubsub';
import { DataFrameEvent, DataFrameEventPayload } from './events/types';
import { Chart } from './pages/charts';
import { useDataFrame } from './store/dataframe';
import './styles/app.css';

const client = new QueryClient();

const { Sider } = Layout;

function App(): React.ReactElement {
  const add = useDataFrame(state => state.add);

  async function init(): Promise<void> {
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
    <Layout className='min-h-screen'>
      <Sider className='bg-gray-100' theme='light' collapsed>
        <Menu
          className='bg-gray-100 mt-2'
          theme='light'
          defaultSelectedKeys={['1']}
          mode='inline'>
          <Menu.Item key='charts' icon={<BiBarChart size={25} />}>
            Charts
          </Menu.Item>
          <Menu.Item key='info' icon={<RiDonutChartFill size={20} />}>
            Info
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Chart />
      </Layout>
    </Layout>
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
