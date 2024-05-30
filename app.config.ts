import { APPLICATION_THEME } from 'react-native-dotenv';

const adaptiveImage =
APPLICATION_THEME?.toLowerCase() === 'purple'
    ? '../assets/purpleSplashScreen.png'
    : './assets/orangeSplashScreen.png';

export default {
  name: 'Inji',
  slug: 'inji',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  splash: {
    image: adaptiveImage,
    resizeMode: 'cover',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'io.mosip.inji.mobileid',
    buildNumber: '1.0.0',
    supportsTablet: true,
  },
  android: {
    package: 'io.mosip.residentapp',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: adaptiveImage,
      backgroundColor: '#FFFFFF',
    },
  },
  platforms: ['android', 'ios'],
  privacy: 'hidden',
  plugins: ['expo-localization'],
};
