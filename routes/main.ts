import React from 'react';
import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { RootStackParamList } from './index';
import { ScanLayout } from '../screens/Scan/ScanLayout';
import i18n from '../i18n';
import { HistoryScreen } from '../screens/History/HistoryScreen';

export const mainRoutes: TabScreen[] = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: 'home',
    options: {
      headerTitle: ' ',
      headerLeft: () =>
        React.createElement(Image, {
          source: require('../assets/inji-home-logo.png'),
          style: { width: 124, height: 27, resizeMode: 'contain' },
        }),
    },
  },
  {
    name: 'Scan',
    component: ScanLayout,
    icon: 'qr-code-scanner',
    options: {
      title: i18n.t('MainLayout:scan'),
      headerShown: false,
    },
  },
  {
    name: 'History',
    component: HistoryScreen,
    icon: 'history',
    options: {
      title: i18n.t('MainLayout:history'),
      headerRight: null,
    },
  },
  // {
  //   name: 'Profile',
  //   component: ProfileScreen,
  //   icon: 'person',
  //   options: {
  //     title: i18n.t('MainLayout:profile'),
  //   },
  // },
];

export type MainBottomTabParamList = {
  Home: {
    activeTab: number;
  };
  Scan: undefined;
  Profile: undefined;
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
