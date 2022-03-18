import { Avatar, Dropdown, Menu } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { Configs, useConfigs } from '../../api/configs';
import { Loader } from '../../components/ui/loader';
import { useConfigsStore } from '../../store/configs';
import { getCryptoIcon } from '../../theme/icons';

export function ConfigDropdown(): React.ReactElement {
  const [getActiveConfig, setActiveConfig] = useConfigsStore(state => [
    state.getActiveConfig,
    state.setActiveConfig,
  ]);

  const { base } = getActiveConfig();
  const { data, loading } = useConfigs();

  let content = (
    <div className='mx-10 my-20'>
      <Loader size='small' />
    </div>
  );

  function renderSymbol(config: Configs): React.ReactNode {
    const { symbol, base } = config;

    function onSymbolSelect(): void {
      setActiveConfig(symbol);
    }

    const isActive = symbol === getActiveConfig().symbol;

    return (
      <Menu.Item
        className={clsx('mt-1 py-2', isActive && 'bg-light')}
        key={symbol}
        onClick={onSymbolSelect}>
        <Avatar className='mr-2' size='small' src={getCryptoIcon(base)} />
        <span className='font-light text-xs'>{symbol}</span>
      </Menu.Item>
    );
  }

  if (data && !loading) {
    const { configs } = data;

    content = <>{React.Children.toArray(configs.map(renderSymbol))}</>;
  }

  const menu = <Menu className='flex flex-col'>{content}</Menu>;

  return (
    <Dropdown
      arrow
      className='cursor-pointer'
      placement='bottom'
      overlay={menu}>
      <Avatar size='small' src={getCryptoIcon(base)} />
    </Dropdown>
  );
}
