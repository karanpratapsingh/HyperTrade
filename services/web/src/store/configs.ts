import find from 'lodash/find';
import create, { GetState, SetState } from 'zustand';
import { Configs, getConfigs } from '../api/configs';

type ConfigsStore = {
  active: Configs | null;
  configs: Configs[];
  setDefault: () => Promise<void>;
  getActiveConfig: () => Configs;
  setActiveConfig: (symbol: string) => void;
};

export const useConfigsStore = create<ConfigsStore>(
  (set: SetState<ConfigsStore>, get: GetState<ConfigsStore>) => ({
    active: null,
    configs: [],
    setDefault: async (): Promise<void> => {
      const { configs } = await getConfigs();
      const [active] = configs;
      set({ active, configs });
    },
    getActiveConfig: (): Configs => {
      const { active } = get();

      if (!active) {
        throw new Error('Configs Store: Cannot get null active config');
      }

      return active;
    },
    setActiveConfig: (symbol: string): void => {
      const { configs } = get();

      const active = find(configs, ['symbol', symbol]);

      if (!active) {
        throw new Error('Configs Store: Cannot set null active config');
      }

      set({ active });
    },
  })
);
