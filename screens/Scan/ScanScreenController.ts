import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ScanEvents,
  selectIsLocationDisabled,
  selectIsLocationDenied,
  selectIsScanning,
  selectIsShowQrLogin,
  selectQrLoginRef,
  selectIsQrLoginStoring,
} from '../../machines/scan';
import { selectShareableVcs } from '../../machines/vc';
import { GlobalContext } from '../../shared/GlobalContext';
import {
  selectIsBluetoothPermissionDenied,
  selectIsNearByDevicesPermissionDenied,
  selectIsBluetoothDenied,
  selectIsStartPermissionCheck,
} from '../../machines/openIdBle/scan';
import { ScanEvents as ScanEvent } from '../../machines/openIdBle/scan';

export function useScanScreen() {
  const { t } = useTranslation('ScanScreen');
  const { appService } = useContext(GlobalContext);
  const scanService = appService.children.get('scan');
  const vcService = appService.children.get('vc');

  const shareableVcs = useSelector(vcService, selectShareableVcs);

  const isLocationDisabled = useSelector(scanService, selectIsLocationDisabled);
  const isLocationDenied = useSelector(scanService, selectIsLocationDenied);
  const isStartPermissionCheck = useSelector(
    scanService,
    selectIsStartPermissionCheck
  );
  const isNearByDevicesPermissionDenied = useSelector(
    scanService,
    selectIsNearByDevicesPermissionDenied
  );
  const isBluetoothPermissionDenied = useSelector(
    scanService,
    selectIsBluetoothPermissionDenied
  );
  const isBluetoothDenied = useSelector(scanService, selectIsBluetoothDenied);
  const locationError = { message: '', button: '' };
  const nearByDevicesPermissionError = { message: '', button: '' };

  if (isLocationDisabled) {
    locationError.message = t('errors.locationDisabled.message');
    locationError.button = t('errors.locationDisabled.button');
  } else if (isLocationDenied) {
    locationError.message = t('errors.locationDenied.message');
    locationError.button = t('errors.locationDenied.button');
  }
  if (isNearByDevicesPermissionDenied) {
    nearByDevicesPermissionError.message = t(
      'errors.nearbyDevicesPermissionDenied.message'
    );
    nearByDevicesPermissionError.button = t(
      'errors.nearbyDevicesPermissionDenied.button'
    );
  }

  return {
    locationError,
    nearByDevicesPermissionError,
    isEmpty: !shareableVcs.length,
    isBluetoothPermissionDenied,
    isNearByDevicesPermissionDenied,
    isLocationDisabled,
    isLocationDenied,
    isBluetoothDenied,
    isStartPermissionCheck,
    isScanning: useSelector(scanService, selectIsScanning),
    isQrLogin: useSelector(scanService, selectIsShowQrLogin),
    isQrLoginstoring: useSelector(scanService, selectIsQrLoginStoring),
    isQrRef: useSelector(scanService, selectQrLoginRef),
    LOCATION_REQUEST: () => scanService.send(ScanEvents.LOCATION_REQUEST()),
    GOTO_SETTINGS: () => scanService.send(ScanEvent.GOTO_SETTINGS()),
    START_PERMISSION_CHECK: () =>
      scanService.send(ScanEvent.START_PERMISSION_CHECK()),
    SCAN: (qrCode: string) => scanService.send(ScanEvents.SCAN(qrCode)),
  };
}
