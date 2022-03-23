import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack';
import { LanguageSelector } from '../components/LanguageSelector';
import { authRoutes, baseRoutes } from '../routes';
import { useAppLayout } from './AppLayoutController';

const { Navigator, Screen } = createNativeStackNavigator();

export const AppLayout: React.FC = () => {
  const controller = useAppLayout();

  const options: NativeStackNavigationOptions = {
    title: '',
    headerTitleAlign: 'center',
    headerShadowVisible: false,
    headerRight: () => <LanguageSelector />,
    headerBackVisible: false,
  };

  return (
    <NavigationContainer>
      <Navigator initialRouteName={baseRoutes[0].name} screenOptions={options}>
        {baseRoutes.map((route) => (
          <Screen key={route.name} {...route} />
        ))}
        {controller.isAuthorized &&
          authRoutes.map((route) => <Screen key={route.name} {...route} />)}
      </Navigator>
    </NavigationContainer>
  );
};
