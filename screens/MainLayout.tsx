import React from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import { mainRoutes } from '../routes/main';
import { RootRouteProps } from '../routes';
import { LanguageSelector } from '../components/LanguageSelector';
import { Theme } from '../components/ui/styleUtils';
import { useTranslation } from 'react-i18next';
import { Row } from '../components/ui';
import LinearGradient from 'react-native-linear-gradient';

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
        <Icon
          name="settings"
          type="simple-line-icon"
          style={Theme.Styles.IconContainer}
          color={Theme.Colors.Icon}
        />
      </Row>
    ),
    headerRightContainerStyle: { paddingEnd: 16 },
    headerTitleAlign: 'center',
    tabBarShowLabel: true,
    tabBarLabelStyle: {
      fontSize: 12,
      color: Theme.Colors.IconBg,
      marginTop: -10,
    },
    tabBarStyle: {
      height: 88,
      paddingHorizontal: 6,
    },
    tabBarItemStyle: {
      height: 86,
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
            title: t(route.name.toLowerCase()),
            tabBarIcon: ({ focused }) => (
              <Icon
                name={route.icon}
                color={focused ? Theme.Colors.IconBg : Theme.Colors.GrayIcon}
                style={focused ? Theme.Styles.bottomTabIconStyle : null}
              />
            ),
          }}
        />
      ))}
    </Navigator>
  );
};
