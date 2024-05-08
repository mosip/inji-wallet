import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ErrorMessageOverlay,
  MessageOverlay,
} from '../../components/MessageOverlay';
import {QrScanner} from '../../components/QrScanner';
import {Button, Centered, Column, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {QrLogin} from '../QrLogin/QrLogin';
import {useScanScreen} from './ScanScreenController';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {Linking} from 'react-native';
import {isIOS} from '../../shared/constants';
import {BannerNotificationContainer} from '../../components/BannerNotificationContainer';
import {SharingStatusModal} from './SharingStatusModal';
import {SvgImage} from '../../components/ui/svg';
import {LocationPermissionRational} from './LocationPermissionRational';
import {FaceVerificationAlertOverlay} from './FaceVerificationAlertOverlay';
import {useSendVcScreen} from './SendVcScreenController';

export const ScanScreen: React.FC = () => {
  const {t} = useTranslation('ScanScreen');
  const scanScreenController = useScanScreen();
  const sendVcScreenController = useSendVcScreen();
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);

  useEffect(() => {
    (async () => {
      await BluetoothStateManager.onStateChange(state => {
        if (state === 'PoweredOff') {
          setIsBluetoothOn(false);
        } else {
          setIsBluetoothOn(true);
        }
      }, true);
    })();
  }, [isBluetoothOn]);

  // TODO(kludge): skip running this hook on every render
  useEffect(() => {
    if (
      scanScreenController.isStartPermissionCheck &&
      !scanScreenController.isEmpty
    )
      scanScreenController.START_PERMISSION_CHECK();
  });

  useEffect(() => {
    if (scanScreenController.isQuickShareDone) scanScreenController.GOTO_HOME();
  }, [scanScreenController.isQuickShareDone]);

  const openSettings = () => {
    Linking.openSettings();
  };

  function noShareableVcText() {
    return (
      <Text
        testID="noShareableVcs"
        align="center"
        style={{paddingTop: 3}}
        color={Theme.Colors.errorMessage}
        margin="0 10">
        {t('noShareableVcs')}
      </Text>
    );
  }

  function bluetoothIsOffText() {
    return (
      <Text
        testID="bluetoothIsTurnedOffMessage"
        align="center"
        color={Theme.Colors.errorMessage}
        margin="0 10">
        {t(isIOS() ? 'bluetoothStateIos' : 'bluetoothStateAndroid')}
      </Text>
    );
  }

  function allowBluetoothPermissionComponent() {
    return (
      <Column padding="24" fill align="space-between">
        <Centered fill>
          <Text
            align="center"
            testID="enableBluetoothMessage"
            color={Theme.Colors.errorMessage}>
            {t('enableBluetoothMessage')}
          </Text>
        </Centered>

        <Button
          testID="enableBluetoothButton"
          title={t('enableBluetoothButtonText')}
          onPress={openSettings}
        />
      </Column>
    );
  }

  function allowNearbyDevicesPermissionComponent() {
    return (
      <Column padding="24" fill align="space-between">
        <Centered fill>
          <Text
            testID="allowNearbyDevicesPermissionMessage"
            align="center"
            color={Theme.Colors.errorMessage}>
            {t('errors.nearbyDevicesPermissionDenied.message')}
          </Text>
        </Centered>

        <Button
          testID="allowNearbyDevicesPermissionButton"
          title={t('errors.nearbyDevicesPermissionDenied.button')}
          onPress={openSettings}
        />
      </Column>
    );
  }

  function allowLocationComponent() {
    return (
      <Column padding="24" fill align="space-between">
        <Centered fill>
          <Text
            testID="enableLocationServicesMessage"
            align="center"
            color={Theme.Colors.errorMessage}>
            {scanScreenController.locationError.message}
          </Text>
        </Centered>

        <Button
          testID="enableLocationServicesButton"
          title={scanScreenController.locationError.button}
          onPress={scanScreenController.LOCATION_REQUEST}
        />
      </Column>
    );
  }

  function qrScannerComponent() {
    return (
      <Column crossAlign="center" margin="0 0 0 -6">
        <QrScanner
          onQrFound={scanScreenController.SCAN}
          title={t('scanningGuide')}
        />
      </Column>
    );
  }

  function loadQRScanner() {
    if (scanScreenController.isEmpty) {
      return noShareableVcText();
    }
    if (scanScreenController.selectIsInvalid) {
      return displayInvalidQRpopup();
    }
    if (scanScreenController.isNearByDevicesPermissionDenied) {
      return allowNearbyDevicesPermissionComponent();
    }
    if (
      (scanScreenController.isBluetoothDenied || !isBluetoothOn) &&
      scanScreenController.isReadyForBluetoothStateCheck
    ) {
      return bluetoothIsOffText();
    }
    if (scanScreenController.isLocalPermissionRational) {
      return (
        <LocationPermissionRational
          onConfirm={scanScreenController.ALLOWED}
          onCancel={scanScreenController.DENIED}
        />
      );
    }
    if (
      scanScreenController.isLocationDisabled ||
      scanScreenController.isLocationDenied
    ) {
      return allowLocationComponent();
    }

    if (scanScreenController.isBluetoothPermissionDenied) {
      return allowBluetoothPermissionComponent();
    }
    if (scanScreenController.isScanning) {
      return qrScannerComponent();
    }
  }

  function displayStorageLimitReachedError(): React.ReactNode {
    return (
      !scanScreenController.isEmpty && (
        <ErrorMessageOverlay
          testID="storageLimitReachedError"
          isVisible={
            scanScreenController.isMinimumStorageRequiredForAuditEntryLimitReached
          }
          translationPath={'ScanScreen'}
          error="errors.storageLimitReached"
          onDismiss={scanScreenController.GOTO_HOME}
        />
      )
    );
  }

  function displayInvalidQRpopup(): React.ReactNode {
    return (
      !scanScreenController.isEmpty && (
        <SharingStatusModal
          isVisible={scanScreenController.selectIsInvalid}
          testId={'invalidQrPopup'}
          image={SvgImage.ErrorLogo()}
          title={t(`status.bleError.TVW_CON_001.title`)}
          message={t(`status.bleError.TVW_CON_001.message`)}
          gradientButtonTitle={t('status.bleError.retry')}
          clearButtonTitle={t('status.bleError.home')}
          onGradientButton={scanScreenController.DISMISS}
          onClearButton={scanScreenController.GOTO_HOME}
        />
      )
    );
  }

  return (
    <Column fill backgroundColor={Theme.Colors.whiteBackgroundColor}>
      <BannerNotificationContainer />
      <FaceVerificationAlertOverlay
        isVisible={sendVcScreenController.isFaceVerificationConsent}
        onConfirm={sendVcScreenController.FACE_VERIFICATION_CONSENT}
        close={sendVcScreenController.DISMISS}
      />
      <Centered
        padding="24 0"
        align="space-evenly"
        backgroundColor={Theme.Colors.whiteBackgroundColor}>
        {loadQRScanner()}
        {scanScreenController.isQrLogin && (
          <QrLogin
            isVisible={scanScreenController.isQrLogin}
            service={scanScreenController.isQrRef}
          />
        )}
        <MessageOverlay
          isVisible={scanScreenController.isQrLoginstoring}
          title={t('loading')}
          progress
        />
      </Centered>
      {displayStorageLimitReachedError()}
    </Column>
  );
};
