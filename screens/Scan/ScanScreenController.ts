import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { selectIsActive, selectIsFocused } from '../../machines/app';

import {
  ScanEvents,
  selectIsLocationDisabled,
  selectIsLocationDenied,
  selectIsScanning,
  selectIsBluetoothDenied,
} from '../../machines/scan';
import { selectVcLabel } from '../../machines/settings';
import { selectShareableVcs } from '../../machines/vc';
import { GlobalContext } from '../../shared/GlobalContext';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

export function useScanScreen() {
  const { t } = useTranslation('ScanScreen');
  const { appService } = useContext(GlobalContext);
  const scanService = appService.children.get('scan');
  const settingsService = appService.children.get('settings');
  const vcService = appService.children.get('vc');

  const shareableVcs = useSelector(vcService, selectShareableVcs);
  const isActive = useSelector(appService, selectIsActive);
  const isFocused = useSelector(appService, selectIsFocused);
  const isBluetoothDenied = useSelector(scanService, selectIsBluetoothDenied);

  useEffect(() => {
    BluetoothStateManager.getState().then((bluetoothState) => {
      if (bluetoothState === 'PoweredOn' && isBluetoothDenied) {
        scanService.send(ScanEvents.SCREEN_FOCUS());
      }
    });
  }, [isFocused, isActive]);

  const isLocationDisabled = useSelector(scanService, selectIsLocationDisabled);
  const isLocationDenied = useSelector(scanService, selectIsLocationDenied);

  const locationError = { message: '', button: '' };

  if (isLocationDisabled) {
    locationError.message = t('errors.locationDisabled.message');
    locationError.button = t('errors.locationDisabled.button');
  } else if (isLocationDenied) {
    locationError.message = t('errors.locationDenied.message');
    locationError.button = t('errors.locationDenied.button');
  }

  return {
    locationError,
    vcLabel: useSelector(settingsService, selectVcLabel),

    isBluetoothDenied,
    isEmpty: !shareableVcs.length,
    isLocationDisabled,
    isLocationDenied,
    isScanning: useSelector(scanService, selectIsScanning),

    LOCATION_REQUEST: () => scanService.send(ScanEvents.LOCATION_REQUEST()),
    SCAN: (qrCode: string) => scanService.send(ScanEvents.SCAN(qrCode)),
    GOTO_SETTINGS: () => scanService.send(ScanEvents.GOTO_SETTINGS()),
  };
}
