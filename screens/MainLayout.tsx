import React, {useContext} from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {mainRoutes, share} from '../routes/main';
import {Theme} from '../components/ui/styleUtils';
import {useTranslation} from 'react-i18next';
import {Column} from '../components/ui';

import {GlobalContext} from '../shared/GlobalContext';
import {ScanEvents} from '../machines/bleShare/scan/scanMachine';
import testIDProps from '../shared/commonUtil';
import {SvgImage} from '../components/ui/svg';
import {isIOS} from '../shared/constants';
import {
  CopilotProvider,
  CopilotStep,
  walkthroughable,
} from 'react-native-copilot';
import {Dimensions, View} from 'react-native';
import {CopilotTooltip} from '../components/CopilotTooltip';

const {Navigator, Screen} = createBottomTabNavigator();

export const MainLayout: React.FC = () => {
  const {t} = useTranslation('MainLayout');

  const {appService} = useContext(GlobalContext);
  const scanService = appService.children.get('scan');

  const options: BottomTabNavigationOptions = {
    tabBarShowLabel: true,
    tabBarActiveTintColor: Theme.Colors.IconBg,
    ...Theme.BottomTabBarStyle,
  };

  const CopilotView = walkthroughable(View);

  return (
    <CopilotProvider
      stopOnOutsideClick
      androidStatusBarVisible
      tooltipComponent={CopilotTooltip}
      tooltipStyle={{
        width: Dimensions.get('screen').width * 1,
        height: Dimensions.get('screen').height * 0.2,
      }}
      animated>
      <Navigator
        initialRouteName={mainRoutes[0].name}
        screenOptions={({route}) => ({
          tabBarAccessibilityLabel: route.name,
          ...options,
        })}>
        {mainRoutes.map((route, index) => (
          <Screen
            key={route.name}
            name={route.name}
            component={route.component}
            listeners={{
              tabPress: e => {
                if (route.name == share.name) {
                  scanService?.send(ScanEvents.RESET());
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
                  {route.name === 'home' ? (
                    <View style={Theme.Styles.tabBarIconCopilot}>
                      {SvgImage[`${route.name}`](focused)}
                    </View>
                  ) : (
                    <CopilotStep
                      text={t(route.name + 'Message')}
                      order={2 + index}
                      name={t(route.name + 'Title')}>
                      <CopilotView style={Theme.Styles.tabBarIconCopilot}>
                        {SvgImage[`${route.name}`](focused)}
                      </CopilotView>
                    </CopilotStep>
                  )}
                </Column>
              ),
              tabBarAccessibilityLabel: isIOS() ? t(route.name) : route.name,
              tabBarTestID: route.name,
            }}
          />
        ))}
      </Navigator>
    </CopilotProvider>
  );
};
