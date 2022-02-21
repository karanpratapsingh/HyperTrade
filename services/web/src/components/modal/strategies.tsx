import { Checkbox, Modal, Slider } from 'antd';
import React, { useEffect, useState } from 'react';
import { Strategies, updateStrategy, useStrategy } from '../../api/strategies';
import { Header } from '../../components/ui/header';
import { Loader } from '../ui/loader';
import * as Notifications from '../../utils/notifications';

interface StrategiesModalProps {
  show: boolean;
  symbol: string;
  onClose: VoidFunction;
}

export function StrategiesModal(
  props: StrategiesModalProps
): React.ReactElement {
  const { show, symbol, onClose } = props;
  const { data, loading, refetch } = useStrategy(symbol);
  const [strategy, setStrategy] = useState<Strategies | null>(null);

  useEffect(() => {
    refetch?.();
  }, [symbol]);

  useEffect(() => {
    if (data && !loading) {
      setStrategy(data?.strategy);
    }
  }, [data, loading]);

  async function onSave(): Promise<void> {
    if (!strategy) {
      Notifications.error('Save Error', new Error('Strategy is null'));
      return;
    }

    await updateStrategy({ strategy });
    onClose();
  }

  function onRsiToggle(event: React.MouseEvent<HTMLElement>): void {
    if (!strategy) {
      Notifications.error('Strategy Error', new Error('Strategy is null'));
      return;
    }

    const update: Strategies = {
      ...strategy,
      rsi: {
        ...strategy.rsi,
        enabled: (event.target as any).checked,
      },
    };

    setStrategy(update);
  }

  function onRsiChange([oversold, overbought]: [number, number]): void {
    if (!strategy?.rsi.enabled) {
      Notifications.warning('Strategy Error', 'RSI is not enabled');
      return;
    }

    const update: Strategies = {
      ...strategy,
      rsi: {
        ...strategy.rsi,
        overbought,
        oversold,
      },
    };

    setStrategy(update);
  }

  let content: React.ReactNode = null;

  if (!strategy) {
    content = <Loader />;
  } else {
    const { rsi } = strategy;

    content = (
      <div>
        <Checkbox checked={rsi.enabled} onClick={onRsiToggle} />
        <Slider
          range
          step={5}
          min={0}
          max={100}
          value={[rsi.oversold, rsi.overbought]}
          onChange={onRsiChange}
          disabled={!rsi.enabled}
        />
      </div>
    );
  }

  const title = (
    <Header
      className='mb-0'
      title='Strategy'
      subtitle={`Configure strategy for ${symbol}`}
    />
  );

  return (
    <Modal
      className='mt-24'
      title={title}
      visible={show}
      onCancel={onClose}
      onOk={onSave}>
      {content}
    </Modal>
  );
}
