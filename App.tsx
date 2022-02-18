import { Buffer } from 'buffer';
import RNBlob from 'react-native-blob-util';
global.Buffer = Buffer;

import React, { useContext } from 'react';
import AppLoading from 'expo-app-loading';
import { AppLayout } from './screens/AppLayout';
import { useFont } from './shared/hooks/useFont';
import { GlobalContextProvider } from './components/GlobalContextProvider';
import { GlobalContext } from './shared/GlobalContext';
import { useSelector } from '@xstate/react';
import { selectIsReady } from './machines/app';

const AppInitialization: React.FC = (props) => {
  const { appService } = useContext(GlobalContext);
  const hasFontsLoaded = useFont();
  const isReady = useSelector(appService, selectIsReady);

  return isReady && hasFontsLoaded ? <AppLayout /> : <AppLoading />;
};

export default function App() {
  return (
    <GlobalContextProvider>
      <AppInitialization />
    </GlobalContextProvider>
  );
}
