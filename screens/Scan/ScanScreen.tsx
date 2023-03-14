import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageOverlay } from '../../components/MessageOverlay';
import { QrScanner } from '../../components/QrScanner';
import { Button, Centered, Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { QrLogin } from '../QrLogin/QrLogin';
import { useScanScreen } from './ScanScreenController';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { Platform } from 'react-native';

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

  function noShareableVcText() {
    return (
      <Text align="center" color={Theme.Colors.errorMessage} margin="0 10">
        {t('noShareableVcs', { vcLabel: controller.vcLabel.plural })}
      </Text>
    );
  }

  function bluetoothIsOffText() {
    return (
      <Text align="center" color={Theme.Colors.errorMessage} margin="0 10">
        {t(
          Platform.OS === 'ios' ? 'BluetoothStateIos' : 'BluetoothStateAndroid'
        )}
      </Text>
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
    if (!isBluetoothOn) {
      return bluetoothIsOffText();
    }
    return qrScannerComponent();
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

        {controller.isLocationDisabled || controller.isLocationDenied ? (
          <Column align="space-between">
            <Text
              align="center"
              margin="16 0"
              color={Theme.Colors.errorMessage}>
              {controller.locationError.message}
            </Text>
            <Button
              title={controller.locationError.button}
              onPress={controller.LOCATION_REQUEST}
            />
          </Column>
        ) : null}
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
