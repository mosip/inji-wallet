import React, { useContext } from 'react';
import AppLoading from 'expo-app-loading';
import { AppLayout } from './screens/AppLayout';
import { useFont } from './shared/hooks/useFont';
import { GlobalContextProvider } from './components/GlobalContextProvider';
import { GlobalContext } from './shared/GlobalContext';
import { useSelector } from '@xstate/react';
import { useTranslation } from 'react-i18next';
import { selectIsReadError, selectIsReady } from './machines/app';
import { DualMessageOverlay } from './components/DualMessageOverlay';
import { useApp } from './screens/AppController';

const AppInitialization: React.FC = () => {
  const { appService } = useContext(GlobalContext);
  const hasFontsLoaded = useFont();
  const isReady = useSelector(appService, selectIsReady);
  const isReadError = useSelector(appService, selectIsReadError);
  const controller = useApp();
  const { t } = useTranslation('WelcomeScreen');
  if (isReadError) {
    return (
      <DualMessageOverlay
        isVisible={isReadError}
        title={t('failedToReadKeys')}
        message={t('retryRead')}
        onTryAgain={() => {
          controller.TRY_AGAIN();
        }}
        onIgnore={() => {
          controller.IGNORE();
        }}
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
