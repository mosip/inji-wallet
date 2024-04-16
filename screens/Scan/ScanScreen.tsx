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

export const ScanScreen: React.FC = () => {
  const {t} = useTranslation('ScanScreen');
  const controller = useScanScreen();
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
    if (controller.isStartPermissionCheck && !controller.isEmpty)
      controller.START_PERMISSION_CHECK();
  });

  useEffect(() => {
    if (controller.isQuickShareDone) controller.GOTO_HOME();
  }, [controller.isQuickShareDone]);

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
            {controller.locationError.message}
          </Text>
        </Centered>

        <Button
          testID="enableLocationServicesButton"
          title={controller.locationError.button}
          onPress={controller.LOCATION_REQUEST}
        />
      </Column>
    );
  }

  function qrScannerComponent() {
    return (
      <Column crossAlign="center" margin="0 0 0 -6">
        <QrScanner onQrFound={controller.SCAN} title={t('scanningGuide')} />
      </Column>
    );
  }

  function loadQRScanner() {
    if (controller.isEmpty) {
      return noShareableVcText();
    }
    if (controller.selectIsInvalid) {
      return displayInvalidQRpopup();
    }
    if (controller.isNearByDevicesPermissionDenied) {
      return allowNearbyDevicesPermissionComponent();
    }
    if (
      (controller.isBluetoothDenied || !isBluetoothOn) &&
      controller.isReadyForBluetoothStateCheck
    ) {
      return bluetoothIsOffText();
    }
    if (controller.isLocalPermissionRational) {
      return (
        <LocationPermissionRational
          onConfirm={controller.ALLOWED}
          onCancel={controller.DENIED}
        />
      );
    }
    if (controller.isLocationDisabled || controller.isLocationDenied) {
      return allowLocationComponent();
    }

    if (controller.isBluetoothPermissionDenied) {
      return allowBluetoothPermissionComponent();
    }
    if (controller.isScanning) {
      return qrScannerComponent();
    }
  }

  function displayStorageLimitReachedError(): React.ReactNode {
    return (
      !controller.isEmpty && (
        <ErrorMessageOverlay
          testID="storageLimitReachedError"
          isVisible={
            controller.isMinimumStorageRequiredForAuditEntryLimitReached
          }
          translationPath={'ScanScreen'}
          error="errors.storageLimitReached"
          onDismiss={controller.GOTO_HOME}
        />
      )
    );
  }

  function displayInvalidQRpopup(): React.ReactNode {
    return (
      !controller.isEmpty && (
        <SharingStatusModal
          isVisible={controller.selectIsInvalid}
          testId={'invalidQrPopup'}
          image={SvgImage.ErrorLogo()}
          title={t(`status.bleError.TVW_CON_001.title`)}
          message={t(`status.bleError.TVW_CON_001.message`)}
          gradientButtonTitle={t('status.bleError.retry')}
          clearButtonTitle={t('status.bleError.home')}
          onGradientButton={controller.DISMISS}
          onClearButton={controller.GOTO_HOME}
        />
      )
    );
  }

  return (
    <Column fill backgroundColor={Theme.Colors.whiteBackgroundColor}>
      <BannerNotificationContainer />
      <Centered
        padding="24 0"
        align="space-evenly"
        backgroundColor={Theme.Colors.whiteBackgroundColor}>
        {loadQRScanner()}
        {controller.isQrLogin && (
          <QrLogin
            isVisible={controller.isQrLogin}
            service={controller.isQrRef}
          />
        )}
        <MessageOverlay
          isVisible={controller.isQrLoginstoring}
          title={t('loading')}
          progress
        />
      </Centered>
      {displayStorageLimitReachedError()}
    </Column>
  );
};
