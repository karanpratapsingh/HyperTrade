import { Button, Input, Layout, Modal, PageHeader } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { includes, toLower } from 'lodash';
import React, { useState } from 'react';
import { AiOutlineAreaChart, AiOutlineFunction } from 'react-icons/ai';
import { BiBarChart } from 'react-icons/bi';
import { IoSearchOutline } from 'react-icons/io5';
import {
  ChartType,
  IndicatorsInfo,
  KlineChart,
  TechnicalIndicators
} from '../components/charts/kline';
import { Header } from '../components/ui/header';
import { Colors } from '../theme/colors';

const { Content } = Layout;

const mainIndicators: TechnicalIndicators[] = [
  TechnicalIndicators.MA,
  TechnicalIndicators.EMA,
  TechnicalIndicators.SMA,
  TechnicalIndicators.BOLL,
  TechnicalIndicators.SAR,
  TechnicalIndicators.BBI,
];

const subIndicators = Object.keys(TechnicalIndicators) as TechnicalIndicators[];

export function Chart(): React.ReactElement {
  const [showIndicators, setShowIndicators] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [type, setType] = useState<ChartType>(ChartType.CANDLE);
  const [main, setMain] = useState<TechnicalIndicators[]>([]);
  const [sub, setSub] = useState<TechnicalIndicators[]>([
    TechnicalIndicators.VOL,
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
      <KlineChart type={type} main={main} sub={sub} />
      <Modal
        title={<Header title='Indicators' subtitle='Select indicators' />}
        visible={showIndicators}
        footer={null}
        onCancel={() => setShowIndicators(false)}>
        <Input
          className='mb-4'
          value={search}
          onChange={({ target }) => setSearch(target.value)}
          prefix={<IoSearchOutline />}
        />
        <div
          className='flex flex-col'
          style={{ height: 400, overflowY: 'scroll' }}>
          <ListItem
            title='Primary'
            search={search}
            all={mainIndicators}
            indicators={main}
            onUpdate={(update: TechnicalIndicators[]) => setMain(update)}
          />
          <ListItem
            title='Secondary'
            search={search}
            all={subIndicators}
            indicators={sub}
            onUpdate={(update: TechnicalIndicators[]) => setSub(update)}
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

function searchFilter<T extends string>(collection: T[], value: string): T[] {
  return [...collection].filter(indicator => {
    if (value === '') {
      return true;
    }

    return includes(toLower(indicator), toLower(value));
  });
}

function ListItem(props: ListProps): React.ReactElement {
  const { title, all, search, indicators, onUpdate } = props;

  const filtered = searchFilter<TechnicalIndicators>(all, search);

  function renderList(indicator: TechnicalIndicators): React.ReactNode {
    function onClick({ target }: React.MouseEvent<HTMLElement>) {
      const { checked }: any = target;
      let update = [...indicators];

      if (!checked) {
        update = update.filter(key => key !== indicator);
      } else {
        update = [...update, indicator];
      }
      onUpdate(update);
    }

    const checked = indicators.includes(indicator);

    return (
      <div className='flex my-1 items-center'>
        <Checkbox checked={checked} onClick={onClick} />
        <span className='ml-2 font-light'>
          {indicator}
          <span className='ml-1 italic font-light text-gray-400'>
            ({IndicatorsInfo[indicator]})
          </span>
        </span>
      </div>
    );
  }

  let content: React.ReactNode | React.ReactNode[] = filtered.map(renderList);

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
