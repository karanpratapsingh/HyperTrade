import { Button, Checkbox, Input, Layout, Modal } from 'antd';
import includes from 'lodash/includes';
import toLower from 'lodash/toLower';
import React, { useState } from 'react';
import {
  AiOutlineAreaChart,
  AiOutlineFieldNumber,
  AiOutlineFunction,
  AiOutlinePercentage,
} from 'react-icons/ai';
import { BiBarChart } from 'react-icons/bi';
import { IoSearchOutline } from 'react-icons/io5';
import { AxisType, ChartType, KlineChart } from '../components/charts/kline';
import { IndicatorLabel } from '../components/ui/form';
import { Header } from '../components/ui/header';
import {
  PrimaryIndicators,
  SecondaryIndicators,
  TechnicalIndicators,
} from '../config/indicators';
import { useIndicatorsStore } from '../store/indicators';
import { Colors } from '../theme/colors';

const { Content } = Layout;

export function Chart(): React.ReactElement {
  const {
    type,
    axis,
    primary,
    secondary,
    setPrimary,
    setSecondary,
    setType,
    setAxis,
  } = useIndicatorsStore();

  const [showIndicators, setShowIndicators] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const typeIcon: Record<ChartType, React.ReactNode> = {
    [ChartType.AREA]: (
      <BiBarChart
        size={25}
        color={Colors.dark}
        onClick={() => setType(ChartType.CANDLE)}
      />
    ),
    [ChartType.CANDLE]: (
      <AiOutlineAreaChart
        size={25}
        color={Colors.dark}
        onClick={() => setType(ChartType.AREA)}
      />
    ),
  };

  const axisIcon: Record<AxisType, React.ReactNode> = {
    [AxisType.NORMAL]: (
      <AiOutlinePercentage
        size={22}
        color={Colors.dark}
        onClick={() => setAxis(AxisType.PERCENTAGE)}
      />
    ),
    [AxisType.PERCENTAGE]: (
      <AiOutlineFieldNumber
        size={25}
        color={Colors.dark}
        onClick={() => setAxis(AxisType.NORMAL)}
      />
    ),
  };

  const extra: React.ReactNode[] = React.Children.toArray([
    <Button type='link' icon={typeIcon[type]} />,
    <Button type='link' icon={axisIcon[axis]} />,
    <Button
      className='mr-12'
      type='link'
      icon={
        <AiOutlineFunction
          size={25}
          color={Colors.dark}
          onClick={() => setShowIndicators(true)}
        />
      }
    />,
  ]);

  return (
    <Content className='p-6 bg-white'>
      <Header title='Charts' subtitle='Live data charts' extra={extra} />
      <KlineChart
        type={type}
        axis={axis}
        primary={primary}
        secondary={secondary}
      />
      <Modal
        className='mt-24'
        title={
          <Header
            className='!mb-0'
            title='Indicators'
            subtitle='Select indicators'
          />
        }
        visible={showIndicators}
        footer={null}
        onCancel={() => setShowIndicators(false)}>
        <Input
          autoFocus
          size='large'
          value={search}
          onChange={({ target }) => setSearch(target.value)}
          prefix={<IoSearchOutline />}
        />
        <div className='flex flex-col h-96 mt-2 overflow-y-scroll'>
          <IndicatorsList
            title='Primary'
            search={search}
            all={PrimaryIndicators}
            indicators={primary}
            onUpdate={(update: TechnicalIndicators[]) => setPrimary(update)}
          />
          <IndicatorsList
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

interface IndicatorsListProps {
  title: string;
  search: string;
  all: TechnicalIndicators[];
  indicators: TechnicalIndicators[];
  onUpdate: (update: TechnicalIndicators[]) => void;
}

function IndicatorsList(props: IndicatorsListProps): React.ReactElement {
  const { title, all, search, indicators, onUpdate } = props;

  const filtered = searchFilter(all, search);

  function renderList(indicator: TechnicalIndicators): React.ReactNode {
    const { name, description } = indicator;

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
        <IndicatorLabel name={name} description={description} />
      </div>
    );
  }

  let content: React.ReactNode | React.ReactNode[] = React.Children.toArray(
    filtered.map(renderList)
  );

  if (!filtered.length) {
    content = (
      <div className='mb-1'>
        <span className='italic font-light text-dark-gray'>Not found</span>
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
