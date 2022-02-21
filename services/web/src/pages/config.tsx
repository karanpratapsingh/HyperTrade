import { Avatar, Card, Col, InputNumber, Layout, Row } from 'antd';
import sortBy from 'lodash/sortBy';
import React, { useState } from 'react';
import { RiSettings3Fill } from 'react-icons/ri';
import Switch from 'react-switch';
import {
  Configs,
  UpdateAllowedAmountRequest,
  UpdateTradingEnabledRequest,
  useConfigs,
  useUpdateAllowedAmount,
  useUpdateTradingEnabled,
} from '../api/configs';
import { StrategyModal } from '../components/modal/strategy';
import * as animated from '../components/ui/animated';
import { Header } from '../components/ui/header';
import { Loader } from '../components/ui/loader';
import { ContentRow } from '../components/ui/form';
import { Colors } from '../theme/colors';
import { getCryptoIcon } from '../theme/icons';

const { Content } = Layout;
const { Meta } = Card;

export function Config(): React.ReactElement {
  const { data, loading } = useConfigs();
  const { mutate: mutateTradingEnabled, loading: loadingTradingEnabled } =
    useUpdateTradingEnabled();
  const { mutate: mutateAllowedAmount } = useUpdateAllowedAmount();
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [currentSymbol, setCurrentSymbol] = useState<Configs['symbol'] | null>(
    null
  );

  function renderConfig(config: Configs): React.ReactNode {
    const { symbol, base, quote, minimum, allowed_amount, trading_enabled } =
      config;

    function onSettings(): void {
      setCurrentSymbol(symbol);
      setShowSettings(true);
    }

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

    const symbolAvatar = <Avatar size='large' src={getCryptoIcon(base)} />;
    const baseAvatar = <Avatar size='small' src={getCryptoIcon(base)} />;
    const quoteAvatar = <Avatar size='small' src={getCryptoIcon(quote)} />;

    const settings = (
      <RiSettings3Fill
        className='cursor-pointer'
        color={Colors.lightGray}
        size={25}
        onClick={onSettings}
      />
    );

    const tradingSwitch = (
      <Switch
        height={18}
        width={30}
        handleDiameter={12}
        checked={trading_enabled}
        onColor={Colors.primary}
        offColor={Colors.lightGray}
        disabled={loadingTradingEnabled}
        uncheckedIcon={false}
        checkedIcon={false}
        onChange={onUpdateTradingEnable}
      />
    );

    const title = (
      <ContentRow label={symbol} content={settings} suffix={tradingSwitch} />
    );

    const description = (
      <div className='flex flex-col'>
        <ContentRow label='Base' content={baseAvatar} />
        <ContentRow label='Quote' content={quoteAvatar} />
        <ContentRow label='Minimum' content={minimum} suffix={quoteAvatar} />
        <ContentRow
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
    );

    return (
      <Col span={6}>
        <Card className='w-min-full'>
          <Meta avatar={symbolAvatar} title={title} description={description} />
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
      <animated.Div>
        <Row gutter={[16, 16]}>
          {React.Children.toArray(sortBy(configs, 'symbol').map(renderConfig))}
        </Row>
      </animated.Div>
    );
  }

  return (
    <Content className='p-6 bg-white flex flex-col'>
      <Header title='Config' subtitle='Configure your assets' />
      {content}
      {currentSymbol && (
        <StrategyModal
          show={showSettings}
          symbol={currentSymbol}
          onClose={() => setShowSettings(false)}
        />
      )}
    </Content>
  );
}
