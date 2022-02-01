import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BiBarChart } from 'react-icons/bi';
import { RiDonutChartFill } from 'react-icons/ri';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ErrorBoundary } from './components/misc/error-boundary';
import { PubSub } from './events/pubsub';
import { DataFrameEvent, DataFrameEventPayload } from './events/types';
import { Chart } from './pages/charts';
import { useDataFrame } from './store/dataframe';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './styles/app.css';
import { Info } from './pages/info';

enum Paths {
  HOME = '/',
  INFO = '/info',
}

enum MenuItem {
  CHARTS = 'charts',
  INFO = 'info',
}

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
          defaultSelectedKeys={[MenuItem.CHARTS]}
          mode='inline'>
          <Menu.Item key={MenuItem.CHARTS} icon={<BiBarChart size={25} />}>
            <Link to={Paths.HOME}>Charts</Link>
          </Menu.Item>
          <Menu.Item key={MenuItem.INFO} icon={<RiDonutChartFill size={20} />}>
            <Link to={Paths.INFO}>Info</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Routes>
          <Route path={Paths.HOME} element={<Chart />} />
          <Route path={Paths.INFO} element={<Info />} />
        </Routes>
      </Layout>
    </Layout>
  );
}

ReactDOM.render(
  <QueryClientProvider client={client}>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </QueryClientProvider>,
  document.getElementById('root')
);
