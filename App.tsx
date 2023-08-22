import React, { useContext, useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import { AppLayout } from './screens/AppLayout';
import { useFont } from './shared/hooks/useFont';
import { GlobalContextProvider } from './components/GlobalContextProvider';
import { GlobalContext } from './shared/GlobalContext';
import { useSelector } from '@xstate/react';
import { useTranslation } from 'react-i18next';
import {
  selectIsDecryptError,
  selectIsKeyInvalidateError,
  selectIsReadError,
  selectIsReady,
} from './machines/app';
import { DualMessageOverlay } from './components/DualMessageOverlay';
import { useApp } from './screens/AppController';
import { Alert } from 'react-native';
import {
  getTelemetryConfigData,
  initializeTelemetry,
} from './shared/telemetry/TelemetryUtils';
import { ErrorMessageOverlay } from './components/MessageOverlay';
import SecureKeystore from 'react-native-secure-keystore';
import { isCustomSecureKeystore } from './shared/cryptoutil/cryptoUtil';
import i18n from './i18n';

// kludge: this is a bad practice but has been done temporarily to surface
//  an occurance of a bug with minimal residual code changes, this should
//  be removed once the bug cause is determined & fixed, ref: INJI-222
const DecryptErrorAlert = (controller, t) => {
  const heading = t('errors.decryptionFailed');
  const desc = t('errors.decryptionFailed');
  const ignoreBtnTxt = t('ignore');
  Alert.alert(heading, desc, [
    {
      text: ignoreBtnTxt,
      onPress: () => controller.ignoreDecrypt(),
      style: 'cancel',
    },
  ]);
};
function configureTelemetry() {
  const config = getTelemetryConfigData();
  initializeTelemetry(config);
}

const AppLayoutWrapper: React.FC = () => {
  const { appService } = useContext(GlobalContext);
  const isDecryptError = useSelector(appService, selectIsDecryptError);
  const controller = useApp();
  const { t } = useTranslation('WelcomeScreen');
  if (isDecryptError) {
    DecryptErrorAlert(controller, t);
  }
  configureTelemetry();
  return <AppLayout />;
};

const AppLoadingWrapper: React.FC = () => {
  const { appService } = useContext(GlobalContext);
  const isReadError = useSelector(appService, selectIsReadError);
  const isKeyInvalidateError = useSelector(
    appService,
    selectIsKeyInvalidateError
  );
  const controller = useApp();
  const { t } = useTranslation('WelcomeScreen');
  return (
    <>
      <AppLoading />

      <ErrorMessageOverlay
        translationPath={'WelcomeScreen'}
        isVisible={isKeyInvalidateError}
        error={'errors.invalidateKeyError'}
        onDismiss={controller.RESET}
      />

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
  const { t } = useTranslation('common');

  useEffect(() => {
    if (isCustomSecureKeystore()) {
      SecureKeystore.updatePopup(
        t('biometricPopup.title'),
        t('biometricPopup.description')
      );
    }
  }, [i18n.language]);

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
