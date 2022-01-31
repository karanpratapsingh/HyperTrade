import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AiOutlineAreaChart } from 'react-icons/ai';
import { RiDonutChartFill } from 'react-icons/ri';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ErrorBoundary } from './components/error-boundary';
import { PubSub } from './events/pubsub';
import { DataFrameEvent, DataFrameEventPayload } from './events/types';
import { Chart } from './pages/chart';
import { useDataFrame } from './store/dataframe';
import './styles/app.css';

const client = new QueryClient();

const {  Sider } = Layout;

function App(): React.ReactElement {
  const [collapsed, setCollapsed] = useState(true);

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
    <Layout className='min-h-screen'>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}>
        <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline'>
          <Menu.Item icon={<AiOutlineAreaChart size={20} />}>Trade</Menu.Item>
          <Menu.Item icon={<RiDonutChartFill size={20} />}>Info</Menu.Item>
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
