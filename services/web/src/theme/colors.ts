import { Signal } from '../events/types';

export enum Colors {
  primary = '#1890ff',
  gray = '#9ca3af',
  lightGray = '#ddd',
  black = '#202020',
}

export const LineColors = {
  entry: '#5ad8a6',
  exit: '#8884d8',
};

export const StatsColors = {
  profit: '#27a59a',
  loss: '#ef534f',
};

export const FinalTagColors = {
  Yes: 'green',
  No: 'red',
};

export const SignalTagColors: Record<Signal, string> = {
  [Signal.BUY]: 'green',
  [Signal.SELL]: 'red',
  [Signal.NONE]: 'geekblue',
};
