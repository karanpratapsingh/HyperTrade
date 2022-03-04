export enum MenuItem {
  CHART = 'chart',
  DATAFRAME = 'dataframe',
  PORTFOLIO = 'portfolio',
  CONFIG = 'config',
}

export enum Paths {
  HOME = '/',
  DATAFRAME = '/dataframe',
  PORTFOLIO = '/portfolio',
  CONFIG = '/config',
}

export const DefaultKey: Record<Paths, MenuItem> = {
  [Paths.HOME]: MenuItem.CHART,
  [Paths.DATAFRAME]: MenuItem.DATAFRAME,
  [Paths.PORTFOLIO]: MenuItem.PORTFOLIO,
  [Paths.CONFIG]: MenuItem.CONFIG,
};
