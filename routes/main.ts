import React from 'react';
import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { RootStackParamList } from './index';
import { ScanLayout } from '../screens/Scan/ScanLayout';
import { HistoryScreen } from '../screens/History/HistoryScreen';
import i18n from '../i18n';

const home: TabScreen = {
  name: 'home',
  component: HomeScreen,
  icon: 'home',
  options: {
    headerTitle: '',
    headerLeft: () =>
      React.createElement(Image, {
        source: require('../assets/inji-home-logo.png'),
        style: { width: 124, height: 27, resizeMode: 'contain' },
      }),
  },
};
export const scan: TabScreen = {
  name: 'scan',
  component: ScanLayout,
  icon: 'qr-code-scanner',
  options: {
    title: i18n.t('MainLayout:scan'),
    headerShown: false,
  },
};
const history: TabScreen = {
  name: 'history',
  component: HistoryScreen,
  icon: 'history',
  options: {
    title: i18n.t('MainLayout:history'),
    headerRight: null,
  },
};

export const mainRoutes: TabScreen[] = [];
mainRoutes.push(home);
mainRoutes.push(scan);
mainRoutes.push(history);

export type MainBottomTabParamList = {
  home: {
    activeTab: number;
  };
  Scan: undefined;
  history: undefined;
};

export interface TabScreen {
  name: string;
  icon: string;
  component: React.FC;
  options?: BottomTabNavigationOptions;
}

export type MainRouteProps = BottomTabScreenProps<
  MainBottomTabParamList & RootStackParamList
>;

export type HomeRouteProps = BottomTabScreenProps<
  MainBottomTabParamList & RootStackParamList,
  'home'
>;
