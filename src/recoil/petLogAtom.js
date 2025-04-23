import { atom } from 'recoil';

export const dailyLogsState = atom({
  key: 'dailyLogsState',
  default: [],
});

export const healthLogsState = atom({
  key: 'healthLogsState',
  default: [],
});
