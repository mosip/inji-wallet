import React, { useContext } from 'react';
import AppLoading from 'expo-app-loading';
import { AppLayout } from './screens/AppLayout';
import { useFont } from './shared/hooks/useFont';
import { GlobalContextProvider } from './components/GlobalContextProvider';
import { GlobalContext } from './shared/GlobalContext';
import { useSelector } from '@xstate/react';
import { selectIsReady } from './machines/app';

import './i18n';
import { SplashLogoScreen } from './screens/SplashScreen';

const AppInitialization: React.FC = () => {
  const { appService } = useContext(GlobalContext);
  const hasFontsLoaded = useFont();
  const isReady = useSelector(appService, selectIsReady);

  return isReady && hasFontsLoaded ? (
    <AppLayout />
  ) : (
    <SplashLogoScreen navigation={undefined} route={undefined} />
  );
};

export default function App() {
  return (
    <GlobalContextProvider>
      <AppInitialization />
    </GlobalContextProvider>
  );
}
