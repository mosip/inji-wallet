import React, { useContext } from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import { RequestRouteProps, RootRouteProps } from '../routes';
import { mainRoutes, scan } from '../routes/main';
import { Theme } from '../components/ui/styleUtils';
import { useTranslation } from 'react-i18next';
import { Row } from '../components/ui';
import { Image } from 'react-native';
import { SettingScreen } from './Settings/SettingScreen';
import { HelpScreen } from '../components/HelpScreen';

import { GlobalContext } from '../shared/GlobalContext';
import { ScanEvents } from '../machines/bleShare/scan/scanMachine';
const { Navigator, Screen } = createBottomTabNavigator();

export const MainLayout: React.FC<RootRouteProps & RequestRouteProps> = (
  props
) => {
  const { t } = useTranslation('MainLayout');
  const { appService } = useContext(GlobalContext);
  const scanService = appService.children.get('scan');

  const options: BottomTabNavigationOptions = {
    headerRight: () => (
      <Row align="space-between">
        <HelpScreen
          triggerComponent={
            <Image
              source={require('../assets/help-icon.png')}
              style={{ width: 36, height: 36 }}
            />
          }
          navigation={undefined}
          route={undefined}
        />

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
          navigation={props.navigation}
          route={undefined}
        />
      </Row>
    ),
    headerTitleStyle: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 30,
      margin: 4,
    },
    headerRightContainerStyle: { paddingEnd: 13 },
    headerLeftContainerStyle: { paddingEnd: 13 },
    tabBarShowLabel: true,
    tabBarActiveTintColor: Theme.Colors.IconBg,
    tabBarLabelStyle: {
      fontSize: 12,
      fontFamily: 'Inter_600SemiBold',
    },
    tabBarStyle: {
      height: 82,
      paddingHorizontal: 10,
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
          listeners={{
            tabPress: (e) => {
              if (route.name == scan.name) {
                scanService.send(ScanEvents.RESET());
              }
            },
          }}
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
