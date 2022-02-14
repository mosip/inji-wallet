import React from 'react';
import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { RequestScreen } from '../screens/Request/RequestScreen';
import { ScanScreen } from '../screens/Scan/ScanScreen';
import { RootStackParamList } from './index';

export const mainRoutes: TabScreen[] = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: 'home',
    options: {
      title: 'HOME',
    },
  },
  {
    name: 'Scan',
    component: ScanScreen,
    icon: 'qr-code-scanner',
    options: {
      title: 'SCAN',
      headerShown: false,
    },
  },
  {
    name: 'Request',
    component: RequestScreen,
    icon: 'file-download',
    options: {
      title: 'REQUEST',
    },
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    icon: 'person',
    options: {
      title: 'PROFILE',
    },
  },
];

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
  component: React.FC<MainRouteProps>;
  options?: BottomTabNavigationOptions;
}

export type MainRouteProps = BottomTabScreenProps<
  MainBottomTabParamList & RootStackParamList
>;

export type HomeRouteProps = BottomTabScreenProps<
  MainBottomTabParamList & RootStackParamList,
  'Home'
>;
