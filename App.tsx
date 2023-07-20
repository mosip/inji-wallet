import React, { useContext } from 'react';
import AppLoading from 'expo-app-loading';
import { AppLayout } from './screens/AppLayout';
import { useFont } from './shared/hooks/useFont';
import { GlobalContextProvider } from './components/GlobalContextProvider';
import { GlobalContext } from './shared/GlobalContext';
import { useSelector } from '@xstate/react';
import { useTranslation } from 'react-i18next';
import {
  selectIsDecryptError,
  selectIsReadError,
  selectIsReady,
} from './machines/app';
import { DualMessageOverlay } from './components/DualMessageOverlay';
import { useApp } from './screens/AppController';
import { Text } from 'react-native-elements';
import { MessageOverlay } from './components/MessageOverlay';

const AppInitialization: React.FC = () => {
  const { appService } = useContext(GlobalContext);
  const hasFontsLoaded = useFont();
  const isReady = useSelector(appService, selectIsReady);
  const isReadError = useSelector(appService, selectIsReadError);
  const isDecryptError = useSelector(appService, selectIsDecryptError);
  const controller = useApp();
  const { t } = useTranslation('WelcomeScreen');
  if (isReadError) {
    return (
      <DualMessageOverlay
        isVisible={isReadError}
        title={t('failedToReadKeys')}
        message={t('retryRead')}
        onTryAgain={controller.TRY_AGAIN}
        onIgnore={controller.IGNORE}
      />
    );
  }
  if (isDecryptError) {
    console.log('hello world!!');
    return (
      <MessageOverlay
        isVisible={isReadError}
        title={t('decryptError')}
        message={t('retryRead')}
        onBackdropPress={controller.ignoreDecrypt}
      />
    );
  }
  return isReady && hasFontsLoaded ? <AppLayout /> : <AppLoading />;
};

export default function App() {
  return (
    <GlobalContextProvider>
      <AppInitialization />
    </GlobalContextProvider>
  );
}
