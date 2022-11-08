import React from 'react';
import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import { HomeScreen } from '../screens/Home/HomeScreen';
import { RootStackParamList } from './index';
import { RequestLayout } from '../screens/Request/RequestLayout';
import { ScanLayout } from '../screens/Scan/ScanLayout';
import { ProfileLayout } from '../screens/Profile/ProfileLayout';

export const mainRoutes: TabScreen[] = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: 'home',
  },
  {
    name: 'Scan',
    component: ScanLayout,
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
    name: 'Profile',
    component: ProfileLayout,
    icon: 'person',
    options: {
      headerShown: false,
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
