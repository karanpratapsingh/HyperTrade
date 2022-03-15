import { Avatar, Card, Col, Layout, Row, Switch } from 'antd';
import clsx from 'clsx';
import sortBy from 'lodash/sortBy';
import React, { useState } from 'react';
import { RiSettings3Fill } from 'react-icons/ri';
import {
  Configs,
  UpdateAllowedAmountRequest,
  UpdateTradingEnabledRequest,
  useConfigs,
  useUpdateAllowedAmount,
  useUpdateTradingEnabled,
} from '../api/configs';
import { StrategyModal } from '../components/modals/strategy';
import * as animated from '../components/ui/animated';
import { ContentRow, NumberInput } from '../components/ui/form';
import { Header } from '../components/ui/header';
import { Loader } from '../components/ui/loader';
import { useConfigsStore } from '../store/configs';
import { Colors } from '../theme/colors';
import { getCryptoIcon } from '../theme/icons';

const { Content } = Layout;
const { Meta } = Card;

export function Config(): React.ReactElement {
  const { data, loading } = useConfigs();
  const [getActiveConfig, setActiveConfig] = useConfigsStore(state => [
    state.getActiveConfig,
    state.setActiveConfig,
  ]);
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

    const tradingSwitch: React.ReactNode = (
      <Switch
        size='small'
        checked={trading_enabled}
        loading={loadingTradingEnabled}
        onChange={onUpdateTradingEnable}
      />
    );

    const title: React.ReactNode = (
      <ContentRow label={symbol} content={settings} suffix={tradingSwitch} />
    );

    const description = (
      <div className='flex flex-col text-dark-gray'>
        <ContentRow label='Base' content={baseAvatar} />
        <ContentRow label='Quote' content={quoteAvatar} />
        <ContentRow label='Minimum' content={minimum} suffix={quoteAvatar} />
        <ContentRow
          label='Allowed'
          content={
            <NumberInput
              min={minimum}
              defaultValue={allowed_amount}
              onChange={onAmountChange}
            />
          }
          suffix={quoteAvatar}
        />
      </div>
    );

    const isActive = config.symbol === getActiveConfig().symbol;

    function onActiveChange(): void {
      setActiveConfig(config.symbol);
    }

    return (
      <Col span={6}>
        <Card
          className={clsx(
            'w-min-full cursor-pointer',
            isActive && 'border-primary border-2'
          )}
          onClick={onActiveChange}>
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
    const sortedConfig = sortBy(configs, 'symbol');

    content = (
      <animated.Div>
        <Row gutter={[16, 16]}>
          {React.Children.toArray(sortedConfig.map(renderConfig))}
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
