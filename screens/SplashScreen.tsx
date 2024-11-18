import {Dimensions} from 'react-native';
import {RootRouteProps} from '../routes';
import {Image} from 'react-native-elements';
import React, {useEffect} from 'react';
import {APPLICATION_THEME} from 'react-native-dotenv';
import {Column} from '../components/ui';
import {useAppLayout} from './AppLayoutController';

export const SplashScreen: React.FC<RootRouteProps> = props => {
  const imageResource =
    APPLICATION_THEME?.toLowerCase() === 'purple'
      ? require('../assets/purpleSplashScreen.png')
      : require('../assets/SplashScreen.png');
  const controller = useAppLayout();
  useEffect(() => {
    setTimeout(() => {
      if (controller.isLanguagesetup) {
        props.navigation.navigate('Language');
      } else if (controller.isUnAuthorized) {
        props.navigation.navigate('Welcome');
      }
    }, 3000);
  }, [controller.isAuthorized || controller.isLanguagesetup]);

  return (
    <Column
      crossAlign="center"
      style={{
        flex: 1,
        justifyContent: 'center',
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
      }}>
      <Image
        resizeMode="contain"
        style={{
          width: Dimensions.get('screen').width - 180,
          height: Dimensions.get('screen').height - 120,
        }}
        source={imageResource}
      />
    </Column>
  );
};
