import { Button, Layout, PageHeader, Select, Tag } from 'antd';
import React, { useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { FcCandleSticks, FcAreaChart } from 'react-icons/fc';
import {
  ChartType,
  KlineChart,
  TechnicalIndicators,
} from '../components/charts/kline';
import { Header } from '../components/ui/header';

interface SelectIndicatorsProps {
  value: TechnicalIndicators[];
  placeholder: string;
  onChange: (indicators: TechnicalIndicators[]) => void;
}

const options = Object.keys(TechnicalIndicators);

const TagColor: Record<TechnicalIndicators, string> = {
  [TechnicalIndicators.RSI]: 'purple',
  [TechnicalIndicators.MACD]: 'red',
  [TechnicalIndicators.VOL]: 'orange',

  [TechnicalIndicators.MA]: 'gold',
  [TechnicalIndicators.EMA]: 'volcano',
  [TechnicalIndicators.SMA]: 'lime',

  [TechnicalIndicators.BOLL]: 'green',
  [TechnicalIndicators.SAR]: 'cyan',
  [TechnicalIndicators.BBI]: 'blue',

  [TechnicalIndicators.KDJ]: 'geekblue',
  [TechnicalIndicators.OBV]: 'magenta',
};

const { Content } = Layout;
const { Option } = Select;

function SelectIndicators(props: SelectIndicatorsProps): React.ReactElement {
  const { value, placeholder, onChange } = props;

  function tagRender(props: any) {
    const { label, value, closable, onClose } = props;

    return (
      <Tag
        className='flex items-center mr-1'
        color={TagColor[value as TechnicalIndicators]}
        closable={closable}
        onClose={onClose}>
        {label}
      </Tag>
    );
  }

  return (
    <Select
      mode='multiple'
      tagRender={tagRender}
      style={{ minWidth: 150 }}
      placeholder={<span className='font-light italic'>{placeholder}</span>}
      value={value}
      onChange={onChange}>
      {options.map(option => (
        <Option value={option} label={option}>
          {option}
        </Option>
      ))}
    </Select>
  );
}

export function Chart(): React.ReactElement {
  const [type, setType] = useState<ChartType>(ChartType.CANDLE);
  const [main, setMain] = useState<TechnicalIndicators[]>([]);
  const [sub, setSub] = useState<TechnicalIndicators[]>([
    TechnicalIndicators.VOL,
  ]);

  function reset(): void {
    setMain([]);
    setSub([]);
  }

  const title = <Header title='Indicators' subtitle='Live data charts' />;

  const typeIcon: Record<ChartType, React.ReactNode> = {
    [ChartType.CANDLE]: (
      <FcCandleSticks size={25} onClick={() => setType(ChartType.AREA)} />
    ),
    [ChartType.AREA]: (
      <FcAreaChart size={25} onClick={() => setType(ChartType.CANDLE)} />
    ),
  };

  const extras = [
    <Button type='link' icon={typeIcon[type]} />,
    <SelectIndicators
      value={main}
      placeholder='main indicators'
      onChange={setMain}
    />,
    <SelectIndicators
      value={sub}
      placeholder='sub indicators'
      onChange={setSub}
    />,
    <Button
      className='text-gray-300'
      type='link'
      icon={<IoCloseCircle />}
      onClick={reset}
    />,
  ];

  return (
    <Content className='p-4 bg-white'>
      <PageHeader className='p-0 pl-2 pr-10' title={title} extra={extras} />
      <KlineChart type={type} main={main} sub={sub} />
    </Content>
  );
}
