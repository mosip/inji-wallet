import React from 'react';
import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {RootStackParamList} from './index';
import {ScanLayout} from '../screens/Scan/ScanLayout';
import {HistoryScreen} from '../screens/History/HistoryScreen';
import i18n from '../i18n';
import {BOTTOM_TAB_ROUTES} from './routesConstants';
import {HomeScreenLayout} from '../screens/HomeScreenLayout';
import {Theme} from '../components/ui/styleUtils';

export const changeTabBarVisible = (visible: string) => {
  Theme.BottomTabBarStyle.tabBarStyle.display = visible;
};

const home: TabScreen = {
  name: BOTTOM_TAB_ROUTES.home,
  component: HomeScreenLayout,
  icon: 'home',
  options: {
    headerTitle: '',
    headerShown: false,
  },
};
export const share: TabScreen = {
  name: BOTTOM_TAB_ROUTES.share,
  component: ScanLayout,
  icon: 'qr-code-scanner',
  options: {
    title: i18n.t('MainLayout:share'),
    headerShown: false,
  },
};

const history: TabScreen = {
  name: BOTTOM_TAB_ROUTES.history,
  component: HistoryScreen,
  icon: 'history',
  options: {
    headerTitleStyle: Theme.Styles.HistoryHeaderTitleStyle,
    title: i18n.t('MainLayout:history'),
    headerRight: null,
  },
};

export const mainRoutes: TabScreen[] = [];
mainRoutes.push(home);
mainRoutes.push(share);
mainRoutes.push(history);

export type MainBottomTabParamList = {
  home: undefined;
  share: undefined;
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
