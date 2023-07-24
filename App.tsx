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
import { MessageOverlay } from './components/MessageOverlay';

const AppLayoutWrapper: React.FC = () => {
  const { appService } = useContext(GlobalContext);
  const isDecryptError = useSelector(appService, selectIsDecryptError);
  const { t } = useTranslation('WelcomeScreen');
  const controller = useApp();
  return (
    <>
      <AppLayout />
      {isDecryptError ? (
        <MessageOverlay
          isVisible={isDecryptError}
          title={t('decryptError')}
          message={t('decryptError')}
          onBackdropPress={controller.ignoreDecrypt}
        />
      ) : null}
    </>
  );
};

const AppLoadingWrapper: React.FC = () => {
  const { appService } = useContext(GlobalContext);
  const isReadError = useSelector(appService, selectIsReadError);
  const controller = useApp();
  const { t } = useTranslation('WelcomeScreen');
  return (
    <>
      <AppLoading />
      {isReadError ? (
        <DualMessageOverlay
          isVisible={isReadError}
          title={t('failedToReadKeys')}
          message={t('retryRead')}
          onTryAgain={controller.TRY_AGAIN}
          onIgnore={controller.IGNORE}
        />
      ) : null}
    </>
  );
};

const AppInitialization: React.FC = () => {
  const { appService } = useContext(GlobalContext);
  const isReady = useSelector(appService, selectIsReady);
  const hasFontsLoaded = useFont();
  return isReady && hasFontsLoaded ? (
    <AppLayoutWrapper />
  ) : (
    <AppLoadingWrapper />
  );
};

export default function App() {
  return (
    <GlobalContextProvider>
      <AppInitialization />
    </GlobalContextProvider>
  );
}
