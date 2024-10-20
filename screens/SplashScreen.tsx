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
      : require('../assets/violetSplashScreen.png');
  const controller = useAppLayout();
  useEffect(() => {
    setTimeout(() => {
      if (controller.isLanguagesetup) {
        props.navigation.navigate('Language');
      } else if (controller.isUnAuthorized) {
        props.navigation.navigate('Welcome');
      } else {
        props.navigation.navigate('IntroSliders');
      }
    }, 3000);
  }, []);

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
        resizeMode="stretch"
        style={{width: 250, height: 150}}
        source={imageResource}
      />
    </Column>
  );
};
