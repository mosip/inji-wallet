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
import {Linking, Platform} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {MainBottomTabParamList} from '../../routes/main';
import {BOTTOM_TAB_ROUTES} from '../../routes/routesConstants';
import {isIOS} from '../../shared/constants';

export const ScanScreen: React.FC = () => {
  type ScanScreenNavigation = NavigationProp<MainBottomTabParamList>;

  const {t} = useTranslation('ScanScreen');
  const controller = useScanScreen();
  const navigation = useNavigation<ScanScreenNavigation>();
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

  const openSettings = () => {
    Linking.openSettings();
  };

  function noShareableVcText() {
    return (
      <Text
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
      <Text align="center" color={Theme.Colors.errorMessage} margin="0 10">
        {t(isIOS() ? 'bluetoothStateIos' : 'bluetoothStateAndroid')}
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
        <QrScanner onQrFound={controller.SCAN} title={t('scanningGuide')} />
      </Column>
    );
  }

  function loadQRScanner() {
    if (controller.isEmpty) {
      return noShareableVcText();
    }
    if (controller.selectIsInvalid) {
      return invalidQR();
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

  function displayStorageLimitReachedError(): React.ReactNode {
    return (
      !controller.isEmpty && (
        <MessageOverlay
          isVisible={
            controller.isMinimumStorageRequiredForAuditEntryLimitReached
          }
          translationPath={'ScanScreen'}
          error="errors.storageLimitReached"
          onBackdropPress={() => navigation.navigate(BOTTOM_TAB_ROUTES.home)}
        />
      )
    );
  }

  function invalidQR(): React.ReactNode {
    return (
      !controller.isEmpty && (
        <MessageOverlay
          isVisible={controller.selectIsInvalid}
          title={t('common.errors.genericError')}
          // TODO: maybe add a message QR invalid
          onButtonPress={() => navigation.navigate(BOTTOM_TAB_ROUTES.scan)}
          buttonText={t('common:tryAgain')}
          customHeight={'auto'}
        />
      )
    );
  }

  return (
    <Column
      fill
      padding="24 0"
      backgroundColor={Theme.Colors.whiteBackgroundColor}>
      <Centered
        fill
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
