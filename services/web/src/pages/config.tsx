import {
  Avatar,
  Button,
  Card,
  Col,
  InputNumber,
  Layout,
  Row,
  Switch
} from 'antd';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { RiSettings3Line } from 'react-icons/ri';
import {
  Configs,
  UpdateAllowedAmountRequest,
  UpdateTradingEnabledRequest,
  useConfigs,
  useUpdateAllowedAmount,
  useUpdateTradingEnabled
} from '../api/configs';
import { Header } from '../components/ui/header';
import { Loader } from '../components/ui/loader';
import { getCryptoIcon } from '../theme/icons';

const { Content } = Layout;
const { Meta } = Card;

export function Config(): React.ReactElement {
  const { data, loading } = useConfigs();
  const { mutate: mutateTradingEnabled, loading: loadingTradingEnabled } =
    useUpdateTradingEnabled();
  const { mutate: mutateAllowedAmount } = useUpdateAllowedAmount();

  function renderConfig(config: Configs): React.ReactNode {
    const { symbol, base, quote, minimum, allowed_amount, trading_enabled } =
      config;

    async function onUpdateTradingEnable(
      enabled: UpdateTradingEnabledRequest['enabled']
    ): Promise<void> {
      mutateTradingEnabled({ symbol, enabled });
    }

    async function onAmountChange(
      amount: UpdateAllowedAmountRequest['amount']
    ): Promise<void> {
      mutateAllowedAmount({ symbol, amount });
    }

    const actions = React.Children.toArray([
      <Button type='link' icon={<RiSettings3Line size={22} />} />,
    ]);

    const symbolAvatar = <Avatar size='large' src={getCryptoIcon(base)} />;
    const baseAvatar = <Avatar size='small' src={getCryptoIcon(base)} />;
    const quoteAvatar = <Avatar size='small' src={getCryptoIcon(quote)} />;

    return (
      <Col span={6}>
        <Card className='w-min-full' actions={actions}>
          <Meta
            avatar={symbolAvatar}
            title={symbol}
            description={
              <div className='flex flex-col'>
                <Column
                  label='Enabled'
                  content={
                    <Switch
                      loading={loadingTradingEnabled}
                      checked={trading_enabled}
                      size='small'
                      onChange={onUpdateTradingEnable}
                    />
                  }
                />
                <Column label='Base' content={baseAvatar} />
                <Column label='Quote' content={quoteAvatar} />
                <Column
                  label='Minimum'
                  content={minimum}
                  suffix={quoteAvatar}
                />
                <Column
                  label='Allowed'
                  content={
                    <InputNumber
                      className='w-16'
                      min={minimum}
                      defaultValue={allowed_amount}
                      onChange={onAmountChange}
                    />
                  }
                  suffix={quoteAvatar}
                />
              </div>
            }
          />
        </Card>
      </Col>
    );
  }

  let content: React.ReactNode = null;

  if (!data || loading) {
    content = <Loader />;
  } else {
    const { configs } = data;
    content = (
      <Row gutter={[16, 16]}>
        {React.Children.toArray(sortBy(configs, 'symbol').map(renderConfig))}
      </Row>
    );
  }

  return (
    <Content className='p-6 bg-white'>
      <Header title='Config' subtitle='Configure your assets' />
      {content}
    </Content>
  );
}

interface ColumnProps {
  label: string;
  content: React.ReactNode;
  suffix?: React.ReactNode;
}

function Column(props: ColumnProps): React.ReactElement {
  const { label, content, suffix } = props;

  return (
    <div className='mb-2 flex items-center justify-between min-w-full'>
      <span>{label}</span>
      <div className='flex items-center'>
        {content}
        {suffix && <div className='ml-2'>{suffix}</div>}
      </div>
    </div>
  );
}
