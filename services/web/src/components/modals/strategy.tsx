import { Checkbox, Collapse, Modal } from 'antd';
import toUpper from 'lodash/toUpper';
import React, { useEffect, useState } from 'react';
import {
  Macd,
  Rsi,
  Strategies,
  useStrategy,
  useUpdateStrategy,
} from '../../api/strategies';
import * as Notifications from '../../utils/notifications';
import { ContentRow, IndicatorLabel, NumberInput } from '../ui/form';
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
      Notifications.error('Save Error', new Error('Cannot save null strategy'));
      return;
    }

    function onSuccess(): void {
      onClose();
    }

    mutate({ strategy }, { onSuccess });
  }

  function onToggle(
    event: React.MouseEvent<HTMLElement>,
    key: 'rsi' | 'macd'
  ): void {
    if (!strategy) {
      Notifications.error(
        'Strategy Error',
        new Error('Cannot toggle null strategy')
      );
      return;
    }

    event.stopPropagation();

    const update: Strategies = {
      ...strategy,
      [key]: {
        ...strategy[key],
        // @ts-expect-error: dynamically injected property
        enabled: event.target.checked,
      },
    };

    setStrategy(update);
  }

  function onStrategyChange(
    type: 'rsi' | 'macd',
    key: keyof Rsi | keyof Macd,
    value: number
  ): void {
    if (!strategy?.[type].enabled) {
      Notifications.warning(
        'Warning',
        `Please enable ${toUpper(type)} strategy first`
      );
      return;
    }

    const update: Strategies = {
      ...strategy,
      [type]: {
        ...strategy?.[type],
        [key]: value,
      },
    };

    setStrategy(update);
  }

  function renderPanel({ key, header, content }: PanelItem): React.ReactNode {
    const { label, checked, onClick } = header;

    const panelHeader: React.ReactNode = (
      <div className='flex items-center justify-content'>
        <Checkbox checked={checked} onClick={onClick} />
        <span className='ml-2 font-light'>{label}</span>
      </div>
    );

    return (
      <Panel
        className='bg-dark-gray bg-opacity-5 p-1 mb-2 last:mb-0'
        key={key}
        header={panelHeader}
        showArrow={false}>
        {content}
      </Panel>
    );
  }

  let content: React.ReactNode = null;

  if (!strategy) {
    content = <Loader />;
  } else {
    const { rsi, macd } = strategy;

    const panels: PanelItem[] = [
      {
        key: 'rsi',
        header: {
          label: (
            <IndicatorLabel name='RSI' description='Relative Strength Index' />
          ),
          checked: rsi.enabled,
          onClick: event => onToggle(event, 'rsi'),
        },
        content: (
          <div className='font-light text-dark-gray'>
            <ContentRow
              label='Period'
              content={
                <NumberInput
                  value={rsi.period}
                  onChange={(value: number) =>
                    onStrategyChange('rsi', 'period', value)
                  }
                />
              }
            />
            <ContentRow
              label='Overbought'
              content={
                <NumberInput
                  value={rsi.overbought}
                  onChange={(value: number) =>
                    onStrategyChange('rsi', 'overbought', value)
                  }
                />
              }
            />
            <ContentRow
              label='Oversold'
              content={
                <NumberInput
                  className='w-16 text-dark-gray'
                  value={rsi.oversold}
                  onChange={(value: number) =>
                    onStrategyChange('rsi', 'oversold', value)
                  }
                />
              }
            />
          </div>
        ),
      },
      {
        key: 'macd',
        header: {
          label: (
            <IndicatorLabel
              name='MACD'
              description='Moving Average Convergence Divergence'
            />
          ),
          checked: macd.enabled,
          onClick: event => onToggle(event, 'macd'),
        },
        content: (
          <div className='font-light text-dark-gray'>
            <ContentRow
              label='Fast'
              content={
                <NumberInput
                  value={macd.fast}
                  onChange={(value: number) =>
                    onStrategyChange('macd', 'fast', value)
                  }
                />
              }
            />
            <ContentRow
              label='Slow'
              content={
                <NumberInput
                  value={macd.slow}
                  onChange={(value: number) =>
                    onStrategyChange('macd', 'slow', value)
                  }
                />
              }
            />
            <ContentRow
              label='Signal'
              content={
                <NumberInput
                  value={macd.signal}
                  onChange={value => onStrategyChange('macd', 'signal', value)}
                />
              }
            />
          </div>
        ),
      },
    ];

    content = (
      <Collapse className='w-full bg-white'>
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
