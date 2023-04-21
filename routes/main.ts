import React from 'react';
import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { RootStackParamList } from './index';
import { RequestLayout } from '../screens/Request/RequestLayout';
import { ScanLayout } from '../screens/Scan/ScanLayout';
import { HistoryScreen } from '../screens/History/HistoryScreen';
import i18n from '../i18n';
import { Platform } from 'react-native';
import { isGoogleNearbyEnabled } from '../lib/smartshare';

const home: TabScreen = {
  name: 'Home',
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
const scan: TabScreen = {
  name: 'Scan',
  component: ScanLayout,
  icon: 'qr-code-scanner',
  options: {
    title: i18n.t('MainLayout:scan'),
    headerShown: false,
  },
};
const request: TabScreen = {
  name: 'Request',
  component: RequestLayout,
  icon: 'file-download',
  options: {
    title: i18n.t('MainLayout:request'),
    headerShown: false,
  },
};
const history: TabScreen = {
  name: 'History',
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

if (Platform.OS !== 'ios' || isGoogleNearbyEnabled) {
  mainRoutes.push(request);
}

mainRoutes.push(history);

export type MainBottomTabParamList = {
  Home: {
    activeTab: number;
  };
  Scan: undefined;
  Request: undefined;
  History: undefined;
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
  'Home'
>;
