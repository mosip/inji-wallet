import React from 'react';
import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { ScanScreen } from '../screens/Scan/ScanScreen';
import { RootStackParamList } from './index';
import { TimerBasedRequestScreen } from '../screens/Request/TimerBasedRequestScreen';
import { RequestLayout } from '../screens/Request/RequestLayout';

export const mainRoutes: TabScreen[] = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: 'home',
  },
  {
    name: 'Scan',
    component: ScanScreen,
    icon: 'qr-code-scanner',
    options: {
      headerShown: false,
    },
  },
  {
    name: 'Request',
    component: RequestLayout,
    icon: 'file-download',
    options: {
      headerShown: false,
    },
  },
  {
    name: 'TimerBasedRequest',
    component: TimerBasedRequestScreen,
    icon: 'timer',
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    icon: 'person',
  },
];

export type MainBottomTabParamList = {
  Home: {
    activeTab: number;
  };
  Scan: undefined;
  Request: undefined;
  TimerBasedRequest: undefined;
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
