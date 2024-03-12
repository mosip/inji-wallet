import React, {useContext} from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {RequestRouteProps, RootRouteProps} from '../routes';
import {mainRoutes, share} from '../routes/main';
import {Theme} from '../components/ui/styleUtils';
import {useTranslation} from 'react-i18next';
import {Column} from '../components/ui';
import {GlobalContext} from '../shared/GlobalContext';
import {ScanEvents} from '../machines/bleShare/scan/scanMachine';
import testIDProps from '../shared/commonUtil';
import {SvgImage} from '../components/ui/svg';

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
        ...options,
      })}>
      {mainRoutes.map(route => (
        <Screen
          key={route.name}
          name={route.name}
          component={route.component}
          listeners={{
            tabPress: e => {
              if (route.name == share.name) {
                scanService.send(ScanEvents.RESET());
              }
            },
          }}
          options={{
            ...route.options,
            title: t(route.name),
            tabBarIcon: ({focused}) => (
              <Column
                {...testIDProps(route.name + 'Icon')}
                align="center"
                crossAlign="center"
                style={focused ? Theme.Styles.bottomTabIconStyle : null}>
                {SvgImage[`${route.name}`](focused)}
              </Column>
            ),
          }}
        />
      ))}
    </Navigator>
  );
};
