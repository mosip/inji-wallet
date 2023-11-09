import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {useTranslation} from 'react-i18next';

import {selectShareableVcsMetadata} from '../../machines/vc';
import {GlobalContext} from '../../shared/GlobalContext';
import {
  selectIsLocationDenied,
  selectIsLocationDisabled,
  selectIsQrLoginStoring,
  selectIsScanning,
  selectIsInvalid,
  selectIsShowQrLogin,
  selectQrLoginRef,
} from '../../machines/bleShare/scan/selectors';
import {
  selectIsBluetoothDenied,
  selectIsNearByDevicesPermissionDenied,
  selectReadyForBluetoothStateCheck,
  selectIsBluetoothPermissionDenied,
  selectIsStartPermissionCheck,
} from '../../machines/bleShare/commonSelectors';
import {
  ScanEvents,
  selectIsMinimumStorageRequiredForAuditEntryLimitReached,
} from '../../machines/bleShare/scan/scanMachine';
import {scan} from '../../routes/main';

export function useScanScreen() {
  const {t} = useTranslation('ScanScreen');
  const {appService} = useContext(GlobalContext);
  const scanService = appService.children.get('scan');
  const vcService = appService.children.get('vc');

  const shareableVcsMetadata = useSelector(
    vcService,
    selectShareableVcsMetadata,
  );

  const isLocationDisabled = useSelector(scanService, selectIsLocationDisabled);
  const isLocationDenied = useSelector(scanService, selectIsLocationDenied);
  const isReadyForBluetoothStateCheck = useSelector(
    scanService,
    selectReadyForBluetoothStateCheck,
  );
  const isStartPermissionCheck = useSelector(
    scanService,
    selectIsStartPermissionCheck,
  );
  const isNearByDevicesPermissionDenied = useSelector(
    scanService,
    selectIsNearByDevicesPermissionDenied,
  );
  const isBluetoothPermissionDenied = useSelector(
    scanService,
    selectIsBluetoothPermissionDenied,
  );
  const isBluetoothDenied = useSelector(scanService, selectIsBluetoothDenied);
  const locationError = {message: '', button: ''};
  const isMinimumStorageRequiredForAuditEntryLimitReached = useSelector(
    scanService,
    selectIsMinimumStorageRequiredForAuditEntryLimitReached,
  );

  if (isLocationDisabled) {
    locationError.message = t('errors.locationDisabled.message');
    locationError.button = t('errors.locationDisabled.button');
  } else if (isLocationDenied) {
    locationError.message = t('errors.locationDenied.message');
    locationError.button = t('errors.locationDenied.button');
  }

  return {
    locationError,
    isEmpty: !shareableVcsMetadata.length,
    isBluetoothPermissionDenied,
    isNearByDevicesPermissionDenied,
    isLocationDisabled,
    isLocationDenied,
    isBluetoothDenied,
    isStartPermissionCheck,
    isReadyForBluetoothStateCheck,
    isMinimumStorageRequiredForAuditEntryLimitReached,
    isScanning: useSelector(scanService, selectIsScanning),
    selectIsInvalid: useSelector(scanService, selectIsInvalid),
    isQrLogin: useSelector(scanService, selectIsShowQrLogin),
    isQrLoginstoring: useSelector(scanService, selectIsQrLoginStoring),
    isQrRef: useSelector(scanService, selectQrLoginRef),
    LOCATION_REQUEST: () => scanService.send(ScanEvents.LOCATION_REQUEST()),
    GOTO_SETTINGS: () => scanService.send(ScanEvents.GOTO_SETTINGS()),
    START_PERMISSION_CHECK: () =>
      scanService.send(ScanEvents.START_PERMISSION_CHECK()),
    SCAN: (qrCode: string) => scanService.send(ScanEvents.SCAN(qrCode)),
  };
}
