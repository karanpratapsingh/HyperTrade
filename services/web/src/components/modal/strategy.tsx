import { Checkbox, Collapse, Modal, Slider } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  Strategies,
  useStrategy,
  useUpdateStrategy,
} from '../../api/strategies';
import * as Notifications from '../../utils/notifications';
import { ContentRow, IndicatorLabel } from '../ui/form';
import { Header } from '../ui/header';
import { Loader } from '../ui/loader';

interface StrategyModalProps {
  show: boolean;
  symbol: string;
  onClose: VoidFunction;
}

const { Panel } = Collapse;

type PanelItem = {
  key: string;
  header: {
    label: React.ReactNode;
    checked: boolean;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
  };
  content: React.ReactNode;
};

export function StrategyModal(props: StrategyModalProps): React.ReactElement {
  const { show, symbol, onClose } = props;

  const { data, loading, refetch } = useStrategy(symbol);
  const { mutate, loading: mutateLoading } = useUpdateStrategy();
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

    function onSuccess(): void {
      onClose();
    }

    mutate({ strategy }, { onSuccess });
  }

  function onRsiToggle(event: React.MouseEvent<HTMLElement>): void {
    if (!strategy) {
      Notifications.error('Strategy Error', new Error('Strategy is null'));
      return;
    }

    event.stopPropagation();

    const update: Strategies = {
      ...strategy,
      rsi: {
        ...strategy.rsi,
        // @ts-expect-error: dynamically injected property
        enabled: event.target.checked,
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

  function renderPanel({ key, header, content }: PanelItem): React.ReactNode {
    return (
      <Panel
        key={key}
        header={
          <div className='flex items-center justify-content'>
            <Checkbox checked={header.checked} onClick={header.onClick} />
            <span className='ml-2 font-light'>{header.label}</span>
          </div>
        }
        showArrow={false}>
        {content}
      </Panel>
    );
  }

  let content: React.ReactNode = null;

  if (!strategy) {
    content = <Loader />;
  } else {
    const { rsi } = strategy;

    const panels: PanelItem[] = [
      {
        key: 'rsi',
        header: {
          label: (
            <IndicatorLabel name='RSI' description='Relative Strength Index' />
          ),
          checked: rsi.enabled,
          onClick: onRsiToggle,
        },
        content: (
          <div className='font-light text-dark-gray'>
            <ContentRow label='Interval' content='14' />
            <ContentRow label='Overbought' content={rsi.overbought} />
            <ContentRow label='Oversold' content={rsi.oversold} />
            <div className='flex w-full items-center'>
              <Slider
                className='w-full'
                range
                marks={{ 0: 0, 100: 100 }}
                step={5}
                min={0}
                max={100}
                value={[rsi.oversold, rsi.overbought]}
                onChange={onRsiChange}
                disabled={!rsi.enabled}
              />
            </div>
          </div>
        ),
      },
    ];

    content = (
      <Collapse className='w-full bg-dark-light bg-opacity-5'>
        {React.Children.toArray(panels.map(renderPanel))}
      </Collapse>
    );
  }

  const title = (
    <Header
      className='!mb-0'
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
      okButtonProps={{
        type: 'link',
        loading: mutateLoading,
      }}
      cancelButtonProps={{
        type: 'link',
        danger: true,
      }}
      onOk={onSave}>
      {content}
    </Modal>
  );
}
