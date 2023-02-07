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
import { Image, Pressable, View } from 'react-native';
import { SettingScreen } from './Settings/SettingScreen';
import { Linking } from 'react-native';
import getAllConfigurations from '../shared/commonprops/commonProps';

const { Navigator, Screen } = createBottomTabNavigator();
let helpUrl = '';

let helpPage = getAllConfigurations().then((response) => {
  helpUrl = response.helpUrl;
});

export const MainLayout: React.FC<RootRouteProps> = () => {
  const { t } = useTranslation('MainLayout');

  const options: BottomTabNavigationOptions = {
    headerRight: () => (
      <Row align="space-between">
        <Pressable
          onPress={() => {
            Linking.openURL(helpUrl);
          }}>
          <Image
            source={require('../assets/help-icon.png')}
            style={{ width: 36, height: 36 }}
          />
        </Pressable>

        <SettingScreen
          triggerComponent={
            <Icon
              name="settings"
              type="simple-line-icon"
              size={21}
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
    tabBarLabelStyle: {
      fontSize: 12,
      color: Theme.Colors.IconBg,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 30,
      margin: 8,
    },
    headerRightContainerStyle: { paddingEnd: 13 },
    headerLeftContainerStyle: { paddingEnd: 13 },
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
