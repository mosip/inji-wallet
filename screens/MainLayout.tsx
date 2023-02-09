import React, { useState } from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import { mainRoutes } from '../routes/main';
import { RootRouteProps } from '../routes';
import { Theme } from '../components/ui/styleUtils';
import { useTranslation } from 'react-i18next';
import { Row } from '../components/ui';
import LinearGradient from 'react-native-linear-gradient';
import { SettingScreen } from './Settings/SettingScreen';

const { Navigator, Screen } = createBottomTabNavigator();

export const MainLayout: React.FC<RootRouteProps> = () => {
  const { t } = useTranslation('MainLayout');

  const options: BottomTabNavigationOptions = {
    headerRight: () => (
      <Row align="space-between">
        <Icon
          name="question"
          type="ant-design"
          style={Theme.Styles.IconContainer}
          color={Theme.Colors.Icon}
        />
        <SettingScreen
          triggerComponent={
            <Icon
              name="settings"
              type="simple-line-icon"
              style={Theme.Styles.IconContainer}
              color={Theme.Colors.Icon}
            />
          }
          navigation={undefined}
          route={undefined}
        />
      </Row>
    ),
    headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 30 },
    headerLeftContainerStyle: { paddingStart: 8 },
    headerRightContainerStyle: { paddingEnd: 13 },
    tabBarShowLabel: true,
    tabBarActiveTintColor: Theme.Colors.IconBg,
    tabBarStyle: {
      height: 82,
      paddingHorizontal: 10,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontFamily: 'Inter_600SemiBold',
    },
    tabBarItemStyle: {
      height: 83,
      padding: 11,
    },
  };

  return (
    <Navigator initialRouteName={mainRoutes[0].name} screenOptions={options}>
      {mainRoutes.map((route) => (
        <Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={{
            ...route.options,
            title: t(route.name),
            tabBarIcon: ({ focused }) => (
              <Icon
                name={route.icon}
                color={focused ? Theme.Colors.Icon : Theme.Colors.GrayIcon}
                style={focused ? Theme.Styles.bottomTabIconStyle : null}
              />
            ),
          }}
        />
      ))}
    </Navigator>
  );
};
