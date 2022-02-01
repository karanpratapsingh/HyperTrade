import { Button, Input, Layout, Modal, PageHeader } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { includes, toLower } from 'lodash';
import React, { useState } from 'react';
import { AiOutlineAreaChart, AiOutlineFunction } from 'react-icons/ai';
import { BiBarChart } from 'react-icons/bi';
import { IoSearchOutline } from 'react-icons/io5';
import {
  ChartType,
  Indicators,
  KlineChart,
  TechnicalIndicators,
} from '../components/charts/kline';
import { Header } from '../components/ui/header';
import { Colors } from '../theme/colors';

const { Content } = Layout;

const PrimaryIndicators: TechnicalIndicators[] = [
  Indicators.MA,
  Indicators.EMA,
  Indicators.SMA,
  Indicators.BOLL,
  Indicators.SAR,
  Indicators.BBI,
];

const SecondaryIndicators = Object.values(Indicators);

export function Chart(): React.ReactElement {
  const [showIndicators, setShowIndicators] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [type, setType] = useState<ChartType>(ChartType.CANDLE);
  const [primary, setPrimary] = useState<TechnicalIndicators[]>([]);
  const [secondary, setSecondary] = useState<TechnicalIndicators[]>([
    Indicators.VOL,
  ]);

  const title = (
    <Header className='pb-4' title='Charts' subtitle='Live data charts' />
  );

  const typeIcon: Record<ChartType, React.ReactNode> = {
    [ChartType.CANDLE]: (
      <BiBarChart
        size={25}
        color={Colors.black}
        onClick={() => setType(ChartType.AREA)}
      />
    ),
    [ChartType.AREA]: (
      <AiOutlineAreaChart
        size={25}
        color={Colors.black}
        onClick={() => setType(ChartType.CANDLE)}
      />
    ),
  };

  const extras = [
    <Button type='link' icon={typeIcon[type]} />,
    <Button
      type='link'
      icon={
        <AiOutlineFunction
          size={25}
          color={Colors.black}
          onClick={() => setShowIndicators(true)}
        />
      }
    />,
  ];

  return (
    <Content className='p-4 bg-white'>
      <PageHeader className='p-0 pl-2 pr-12' title={title} extra={extras} />
      <KlineChart type={type} primary={primary} secondary={secondary} />
      <Modal
        className='mt-24'
        title={<Header title='Indicators' subtitle='Select indicators' />}
        visible={showIndicators}
        footer={null}
        onCancel={() => setShowIndicators(false)}>
        <Input
          value={search}
          onChange={({ target }) => setSearch(target.value)}
          prefix={<IoSearchOutline />}
        />
        <div
          className='flex flex-col mt-3'
          style={{ height: 400, overflowY: 'scroll' }}>
          <ListItem
            title='Primary'
            search={search}
            all={PrimaryIndicators}
            indicators={primary}
            onUpdate={(update: TechnicalIndicators[]) => setPrimary(update)}
          />
          <ListItem
            title='Secondary'
            search={search}
            all={SecondaryIndicators}
            indicators={secondary}
            onUpdate={(update: TechnicalIndicators[]) => setSecondary(update)}
          />
        </div>
      </Modal>
    </Content>
  );
}

interface ListProps {
  title: string;
  search: string;
  all: TechnicalIndicators[];
  indicators: TechnicalIndicators[];
  onUpdate: (update: TechnicalIndicators[]) => void;
}

function ListItem(props: ListProps): React.ReactElement {
  const { title, all, search, indicators, onUpdate } = props;

  const filtered = searchFilter(all, search);

  function renderList(indicator: TechnicalIndicators): React.ReactNode {
    function onCheck(checked: boolean): void {
      let update = [...indicators];

      if (!checked) {
        update = update.filter(({ name }) => name !== indicator.name);
      } else {
        update = [...update, indicator];
      }
      onUpdate(update);
    }

    const checked = indicators.includes(indicator);

    return (
      <div
        className='flex py-1 my-1 items-center cursor-pointer'
        onClick={() => onCheck(!checked)}>
        <Checkbox checked={checked} />
        <span className='ml-2 font-light'>
          {indicator.name}
          <span className='ml-1 italic font-light text-gray-400'>
            ({indicator.description})
          </span>
        </span>
      </div>
    );
  }

  let content: React.ReactNode | React.ReactNode[] = React.Children.toArray(
    filtered.map(renderList)
  );

  if (!filtered.length) {
    content = (
      <div className='mb-1'>
        <span className='italic font-light text-gray-400'>
          No results found
        </span>
      </div>
    );
  }

  return (
    <div className='mb-1'>
      <div className='mb-2 text-base'>{title}</div>
      {content}
    </div>
  );
}

function searchFilter(
  collection: TechnicalIndicators[],
  value: string
): TechnicalIndicators[] {
  return [...collection].filter(indicator => {
    if (value === '') {
      return true;
    }

    return (
      includes(toLower(indicator.name), toLower(value)) ||
      includes(toLower(indicator.description), toLower(value))
    );
  });
}
