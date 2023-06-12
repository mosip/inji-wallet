import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageOverlay } from '../../components/MessageOverlay';
import { QrScanner } from '../../components/QrScanner';
import { Button, Centered, Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { QrLogin } from '../QrLogin/QrLogin';
import { useScanScreen } from './ScanScreenController';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { Linking, Platform } from 'react-native';

export const ScanScreen: React.FC = () => {
  const { t } = useTranslation('ScanScreen');
  const controller = useScanScreen();
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);

  useEffect(() => {
    (async () => {
      await BluetoothStateManager.onStateChange((state) => {
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

  const openSettings = () => {
    Linking.openSettings();
  };

  function noShareableVcText() {
    return (
      <Text align="center" color={Theme.Colors.errorMessage} margin="0 10">
        {t('noShareableVcs')}
      </Text>
    );
  }

  function bluetoothIsOffText() {
    return (
      <Text align="center" color={Theme.Colors.errorMessage} margin="0 10">
        {t(
          Platform.OS === 'ios' ? 'bluetoothStateIos' : 'bluetoothStateAndroid'
        )}
      </Text>
    );
  }

  function allowBluetoothPermissionComponent() {
    return (
      <Column padding="24" fill align="space-between">
        <Centered fill>
          <Text align="center" color={Theme.Colors.errorMessage}>
            {t('enableBluetoothMessage')}
          </Text>
        </Centered>

        <Button
          title={t('enableBluetoothButtonText')}
          onPress={openSettings}></Button>
      </Column>
    );
  }

  function allowNearbyDevicesPermissionComponent() {
    return (
      <Column padding="24" fill align="space-between">
        <Centered fill>
          <Text align="center" color={Theme.Colors.errorMessage}>
            {t('errors.nearbyDevicesPermissionDenied.message')}
          </Text>
        </Centered>

        <Button
          title={t('errors.nearbyDevicesPermissionDenied.button')}
          onPress={openSettings}></Button>
      </Column>
    );
  }

  function allowLocationComponent() {
    return (
      <Column padding="24" fill align="space-between">
        <Centered fill>
          <Text align="center" color={Theme.Colors.errorMessage}>
            {controller.locationError.message}
          </Text>
        </Centered>

        <Button
          title={controller.locationError.button}
          onPress={controller.LOCATION_REQUEST}
        />
      </Column>
    );
  }

  function qrScannerComponent() {
    return (
      <Column crossAlign="center" margin="0 0 0 -6">
        <QrScanner onQrFound={controller.SCAN} />
      </Column>
    );
  }

  function loadQRScanner() {
    if (controller.isEmpty) {
      return noShareableVcText();
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

  return (
    <Column
      fill
      padding="24 0"
      backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
      <Centered
        fill
        align="space-evenly"
        backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
        <Text align="center">{t('header')}</Text>
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
    </Column>
  );
};
