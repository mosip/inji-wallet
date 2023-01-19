import React from 'react';
import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { RootStackParamList } from './index';
import { RequestLayout } from '../screens/Request/RequestLayout';
import { ScanLayout } from '../screens/Scan/ScanLayout';
import i18n from '../i18n';
import { Platform } from 'react-native';
import { isBLEEnabled } from '../lib/smartshare';

var home: TabScreen = {
  name: 'Home',
  component: HomeScreen,
  icon: 'home',
  options: {
    title: i18n.t('MainLayout:home'),
  },
};
var scan: TabScreen = {
  name: 'Scan',
  component: ScanLayout,
  icon: 'qr-code-scanner',
  options: {
    title: i18n.t('MainLayout:scan'),
    headerShown: false,
  },
};
var request: TabScreen = {
  name: 'Request',
  component: RequestLayout,
  icon: 'file-download',
  options: {
    title: i18n.t('MainLayout:request'),
    headerShown: false,
  },
};
var profile: TabScreen = {
  name: 'Profile',
  component: ProfileScreen,
  icon: 'person',
  options: {
    title: i18n.t('MainLayout:profile'),
  },
};

export const mainRoutes: TabScreen[] = [];
mainRoutes.push(home);
mainRoutes.push(scan);
!(Platform.OS === 'ios' && isBLEEnabled) && mainRoutes.push(request);
mainRoutes.push(profile);

export type MainBottomTabParamList = {
  Home: {
    activeTab: number;
  };
  Scan: undefined;
  Request: undefined;
  Profile: undefined;
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
