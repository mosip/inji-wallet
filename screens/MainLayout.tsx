import React, {useContext} from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {mainRoutes, share} from '../routes/main';
import {Theme} from '../components/ui/styleUtils';
import {useTranslation} from 'react-i18next';
import {Column, Text} from '../components/ui';

import {GlobalContext} from '../shared/GlobalContext';
import {ScanEvents} from '../machines/bleShare/scan/scanMachine';
import testIDProps from '../shared/commonUtil';
import {SvgImage} from '../components/ui/svg';
import {isIOS} from '../shared/constants';
import {CopilotProvider} from 'react-native-copilot';
import {View} from 'react-native';
import {CopilotTooltip} from '../components/CopilotTooltip';
import {Copilot} from '../components/ui/Copilot';

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

  return (
    <CopilotProvider
      stopOnOutsideClick
      androidStatusBarVisible
      tooltipComponent={CopilotTooltip}
      tooltipStyle={Theme.Styles.copilotStyle}
      stepNumberComponent={() => null}
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
              title: '',
              tabBarIcon: ({focused}) => (
                <Column
                  {...testIDProps(route.name + 'Icon')}
                  align="center"
                  crossAlign="center"
                  style={focused ? Theme.Styles.bottomTabIconStyle : null}>
                  {route.name === 'home' ? (
                    <View style={Theme.Styles.tabBarIconCopilot}>
                      {SvgImage[`${route.name}`](focused)}
                      <Text
                        color={focused && Theme.Colors.Icon}
                        margin="6 0 0 0">
                        {t(route.name)}
                      </Text>
                    </View>
                  ) : (
                    <Copilot
                      title={t(`copilot:${route.name}Title`)}
                      description={t(`copilot:${route.name}Message`)}
                      order={2 + index}
                      targetStyle={Theme.Styles.tabBarIconCopilot}
                      children={
                        <>
                          {SvgImage[`${route.name}`](focused)}
                          <Text
                            color={focused && Theme.Colors.Icon}
                            margin="6 0 0 0">
                            {t(route.name)}
                          </Text>
                        </>
                      }
                    />
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
