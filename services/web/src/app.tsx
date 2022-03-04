import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BiBarChart } from 'react-icons/bi';
import { RiDonutChartFill, RiSettings3Fill, RiTableFill } from 'react-icons/ri';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/misc/error-boundary';
import { Loader } from './components/ui/loader';
import { MenuItem, Paths } from './config/routes';
import { PubSub } from './events/pubsub';
import { DataFrameEventPayload, Events } from './events/types';
import { Chart } from './pages/chart';
import { Config } from './pages/config';
import { DataFrame } from './pages/dataframe';
import { Portfolio } from './pages/portfolio';
import { useDataFrameStore } from './store/dataframe';
import { useSymbolStore } from './store/symbol';
import './styles/app.css';
import * as Notifications from './utils/notifications';

const client = new QueryClient();

const { Sider } = Layout;

function App(): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(true);
  const setDefault = useSymbolStore(state => state.setDefault);
  const [restore, add] = useDataFrameStore(state => [state.restore, state.add]);

  async function init(): Promise<void> {
    const pubsub = await PubSub.getInstance();

    try {
      await setDefault();
      await restore();
      setLoading(false);
    } catch (err) {
      Notifications.error('Initialization Error', err);
    }

    Notifications.mount(pubsub);
    pubsub.subscribe<DataFrameEventPayload>(Events.DataFrame, payload => {
      add([payload]);
    });
  }

  useEffect(() => {
    init();
  }, []);

  let content: React.ReactNode = <Loader />;

  if (!loading) {
    content = (
      <Layout className='min-h-screen'>
        <Sider className='bg-light' theme='light' collapsed>
          <Menu
            className='bg-light mt-2'
            theme='light'
            mode='inline'
            defaultSelectedKeys={[MenuItem.CHART]}>
            <Menu.Item key={MenuItem.CHART} icon={<BiBarChart size={25} />}>
              <Link to={Paths.HOME}>Chart</Link>
            </Menu.Item>
            <Menu.Item
              key={MenuItem.DATAFRAME}
              icon={<RiTableFill size={19} />}>
              <Link to={Paths.DATAFRAME}>Dataframe</Link>
            </Menu.Item>
            <Menu.Item
              key={MenuItem.PORTFOLIO}
              icon={<RiDonutChartFill size={22} />}>
              <Link to={Paths.PORTFOLIO}>Portfolio</Link>
            </Menu.Item>
            <Menu.Item
              key={MenuItem.CONFIG}
              icon={<RiSettings3Fill size={23} />}>
              <Link to={Paths.CONFIG}>Config</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Routes>
            <Route path={Paths.HOME} element={<Chart />} />
            <Route path={Paths.DATAFRAME} element={<DataFrame />} />
            <Route path={Paths.PORTFOLIO} element={<Portfolio />} />
            <Route path={Paths.CONFIG} element={<Config />} />
          </Routes>
        </Layout>
      </Layout>
    );
  }

  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <ErrorBoundary>{content}</ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
