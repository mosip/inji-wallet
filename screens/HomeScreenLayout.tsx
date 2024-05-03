import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Icon} from 'react-native-elements';
import {Row, Text} from '../components/ui';
import {Header} from '../components/ui/Header';
import {Theme} from '../components/ui/styleUtils';
import {RootRouteProps} from '../routes';
import {HomeScreen} from './Home/HomeScreen';
import {IssuersScreen} from './Issuers/IssuersScreen';
import {SettingScreen} from './Settings/SettingScreen';
import testIDProps from '../shared/commonUtil';
import {SvgImage} from '../components/ui/svg';
import {HelpScreen} from '../components/HelpScreen';
import {I18nManager, View} from 'react-native';
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
    <HelpScreen
      source={'Inji'}
      triggerComponent={
        <View testID="help" style={Theme.HelpScreenStyle.viewStyle}>
          <Row crossAlign="center" style={Theme.HelpScreenStyle.rowStyle}>
            <View testID="helpIcon" style={Theme.HelpScreenStyle.iconStyle}>
              {SvgImage.infoIcon()}
            </View>
            <Text testID="helpText" style={Theme.HelpScreenStyle.labelStyle}>
              {t('help')}
            </Text>
          </Row>
        </View>
      }
    />
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
