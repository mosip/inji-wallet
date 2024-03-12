import {MainBottomTabParamList} from './routeTypes';

export const BOTTOM_TAB_ROUTES = {
  home: 'home' as keyof MainBottomTabParamList,
  share: 'share' as keyof MainBottomTabParamList,
  history: 'history' as keyof MainBottomTabParamList,
};

export const SCAN_ROUTES = {
  ScanScreen: 'ScanScreen' as keyof ScanStackParamList,
  SendVcScreen: 'SendVcScreen' as keyof ScanStackParamList,
};

export const REQUEST_ROUTES = {
  Request: 'Request' as keyof RequestStackParamList,
  RequestScreen: 'RequestScreen' as keyof RequestStackParamList,
  ReceiveVcScreen: 'ReceiveVcScreen' as keyof RequestStackParamList,
};

export type ScanStackParamList = {
  ScanScreen: undefined;
  SendVcScreen: undefined;
};

export type RequestStackParamList = {
  Request: undefined;
  RequestScreen: undefined;
  ReceiveVcScreen: undefined;
};
