import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootStackParamList} from './index';

export type MainBottomTabParamList = {
  home: undefined;
  share: undefined;
  history: undefined;
};

export type MainRouteProps = BottomTabScreenProps<
  MainBottomTabParamList & RootStackParamList
>;

export type HomeRouteProps = BottomTabScreenProps<
  MainBottomTabParamList & RootStackParamList,
  'home'
>;
