import React, {useContext} from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {RequestRouteProps, RootRouteProps} from '../routes';
import {mainRoutes, scan} from '../routes/main';
import {Theme} from '../components/ui/styleUtils';
import {useTranslation} from 'react-i18next';
import {Row} from '../components/ui';
import {Image} from 'react-native';
import {SettingScreen} from './Settings/SettingScreen';
import {HelpScreen} from '../components/HelpScreen';

import {GlobalContext} from '../shared/GlobalContext';
import {ScanEvents} from '../machines/bleShare/scan/scanMachine';
import testIDProps from '../shared/commonUtil';
const {Navigator, Screen} = createBottomTabNavigator();

export const MainLayout: React.FC<
  RootRouteProps & RequestRouteProps
> = props => {
  const {t} = useTranslation('MainLayout');
  const {appService} = useContext(GlobalContext);
  const scanService = appService.children.get('scan');

  const options: BottomTabNavigationOptions = {
    tabBarShowLabel: true,
    tabBarActiveTintColor: Theme.Colors.IconBg,
    ...Theme.BottomTabBarStyle,
  };

  return (
    <Navigator
      initialRouteName={mainRoutes[0].name}
      screenOptions={({route}) => ({
        tabBarAccessibilityLabel: route.name,
        ...options
      })}>
      {mainRoutes.map(route => (
        <Screen
          key={route.name}
          name={route.name}
          component={route.component}
          listeners={{
            tabPress: e => {
              if (route.name == scan.name) {
                scanService.send(ScanEvents.RESET());
              }
            },
          }}
          options={{
            ...route.options,
            title: t(route.name),
            tabBarIcon: ({focused}) => (
              <Icon
                {...testIDProps(route.name + 'Icon')}
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
