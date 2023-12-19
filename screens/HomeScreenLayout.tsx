import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image} from 'react-native';
import {Icon} from 'react-native-elements';
import {HelpScreen} from '../components/HelpScreen';
import {Row} from '../components/ui';
import {Header} from '../components/ui/Header';
import {Theme} from '../components/ui/styleUtils';
import {RootRouteProps} from '../routes';
import {HomeScreen} from './Home/HomeScreen';
import {IssuersScreen} from './Issuers/IssuersScreen';
import {SettingScreen} from './Settings/SettingScreen';
import testIDProps from '../shared/commonUtil';

const {Navigator, Screen} = createNativeStackNavigator();
export const HomeScreenLayout: React.FC<RootRouteProps> = props => {
  const {t} = useTranslation('IssuersScreen');

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(props.route);
    if (routeName === 'IssuersScreen') {
      props.navigation.setOptions({tabBarStyle: {display: 'none'}});
    } else {
      props.navigation.setOptions({
        tabBarShowLabel: true,
        tabBarActiveTintColor: Theme.Colors.IconBg,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter_600SemiBold',
        },
        tabBarStyle: {
          height: 75,
          paddingHorizontal: 10,
        },
        tabBarItemStyle: {
          height: 83,
          padding: 11,
        },
      });
    }
  }, [props.navigation, props.route]);

  const HomeScreenOptions = {
    headerLeft: () =>
      React.createElement(Image, {
        source: Theme.InjiHomeLogo,
        style: {width: 124, height: 27, resizeMode: 'contain'},
      }),
    headerTitle: '',
    headerRight: () => (
      <Row align="space-between">
        <HelpScreen
          triggerComponent={
            <Image {...testIDProps('help')} source={Theme.HelpIcon} style={{width: 36, height: 36}} />
          }
          navigation={undefined}
          route={undefined}
        />

        <SettingScreen
          triggerComponent={
            <Icon
              {...testIDProps('settings')}
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
  };

  return (
    <Navigator>
      <Screen
        key={'HomeScreen'}
        name={'HomeScreen'}
        component={HomeScreen}
        options={HomeScreenOptions}
      />
      <Screen
        key={'Issuers'}
        name={'IssuersScreen'}
        component={IssuersScreen}
        options={{
          header: props => (
            <Header
              goBack={props.navigation.goBack}
              title={t('title')}
              testID="issuersScreenHeader"
            />
          ),
        }}
      />
    </Navigator>
  );
};
