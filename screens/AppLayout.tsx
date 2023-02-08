import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { authRoutes, baseRoutes } from '../routes';
import { useAppLayout } from './AppLayoutController';
import { StatusBar } from 'react-native';

const { Navigator, Screen } = createNativeStackNavigator();

export const AppLayout: React.FC = () => {
  const controller = useAppLayout();

  const options: NativeStackNavigationOptions = {
    title: '',
    headerTitleAlign: 'center',
    headerShadowVisible: false,
    headerBackVisible: false,
  };

  return (
    <NavigationContainer>
      <StatusBar animated={true} barStyle="dark-content" />
      <Navigator
        initialRouteName={
          controller.isLanguagesetup ? baseRoutes[0].name : baseRoutes[1].name
        }
        screenOptions={options}>
        {baseRoutes.map((route) => (
          <Screen key={route.name} {...route} />
        ))}
        {controller.isAuthorized &&
          authRoutes.map((route) => <Screen key={route.name} {...route} />)}
      </Navigator>
    </NavigationContainer>
  );
};
