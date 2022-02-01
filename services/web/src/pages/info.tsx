import { Layout, PageHeader } from 'antd';
import { Header } from '../components/ui/header';

const { Content } = Layout;

export function Info(): React.ReactElement {
  const title = (
    <Header
      className='pb-4'
      title='Info'
      subtitle='Balance, trades and positions'
    />
  );

  return (
    <Content className='p-4 bg-white'>
      <PageHeader className='p-0 pl-2 pr-12' title={title} />
    </Content>
  );
}
