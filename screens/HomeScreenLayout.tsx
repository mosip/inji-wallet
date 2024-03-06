import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Icon} from 'react-native-elements';
import {Row} from '../components/ui';
import {Header} from '../components/ui/Header';
import {Theme} from '../components/ui/styleUtils';
import {RootRouteProps} from '../routes';
import {HomeScreen} from './Home/HomeScreen';
import {IssuersScreen} from './Issuers/IssuersScreen';
import {SettingScreen} from './Settings/SettingScreen';
import testIDProps from '../shared/commonUtil';
import {SvgImage} from '../components/ui/svg';
import {HelpScreen} from '../components/HelpScreen';
import {I18nManager} from 'react-native';
import {isIOS} from '../shared/constants';

export const HomeScreenLayout: React.FC<RootRouteProps> = props => {
  const {t} = useTranslation('IssuersScreen');
  const {Navigator, Screen} = createNativeStackNavigator();

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

  const screenOptions = (
    <Row align="space-between">
      <HelpScreen
        source={'Inji'}
        triggerComponent={
          <Icon
            {...testIDProps('help')}
            accessible={true}
            name="question"
            type="font-awesome"
            size={21}
            style={Theme.Styles.IconContainer}
            color={Theme.Colors.Icon}
          />
        }
      />

      <SettingScreen
        triggerComponent={
          <Icon
            {...testIDProps('settings')}
            accessible={true}
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
  );

  const [isRTL] = useState(I18nManager.isRTL);

  var HomeScreenOptions = {
    headerLeft: () => (isIOS() || !isRTL ? SvgImage.InjiLogo() : screenOptions),
    headerTitle: '',
    headerRight: () =>
      isIOS() || !isRTL ? screenOptions : SvgImage.InjiLogo(),
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
