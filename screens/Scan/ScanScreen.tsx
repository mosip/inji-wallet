import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {MessageOverlay} from '../../components/MessageOverlay';
import {QrScanner} from '../../components/QrScanner';
import {Button, Centered, Column, Text, Row} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {QrLogin} from '../QrLogin/QrLogin';
import {useScanScreen} from './ScanScreenController';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {Linking} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {MainBottomTabParamList} from '../../routes/main';
import {BOTTOM_TAB_ROUTES} from '../../routes/routesConstants';
import {isIOS} from '../../shared/constants';
import {BackupAndRestoreAllScreenBanner} from '../../components/BackupAndRestoreAllScreenBanner';

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
          onPress={openSettings}></Button>
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
          onPress={openSettings}></Button>
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
          testID="storageLimitReachedError"
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

  function displayInvalidQRpopup(): React.ReactNode {
    return (
      !controller.isEmpty && (
        <MessageOverlay
          testID="invalidQrPopup"
          isVisible={controller.selectIsInvalid}
          minHeight={'auto'}
          title={t('invalidQR')}
          onBackdropPress={controller.DISMISS}>
          <Row>
            <Button
              testID="cancel"
              fill
              type="clear"
              title={t('common:cancel')}
              onPress={() => navigation.navigate(BOTTOM_TAB_ROUTES.home)}
              margin={[0, 8, 0, 0]}
            />
            <Button
              testID="tryAgain"
              fill
              title={t('common:tryAgain')}
              onPress={controller.DISMISS}
            />
          </Row>
        </MessageOverlay>
      )
    );
  }

  return (
    <Column
      fill
      padding="24 0"
      backgroundColor={Theme.Colors.whiteBackgroundColor}>
      <BackupAndRestoreAllScreenBanner />
      <Centered
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
