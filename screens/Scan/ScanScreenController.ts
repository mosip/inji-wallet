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
import { selectIsBluetoothDenied } from '../../machines/openIdBle/scan';

export function useScanScreen() {
  const { t } = useTranslation('ScanScreen');
  const { appService } = useContext(GlobalContext);
  const scanService = appService.children.get('scan');
  const vcService = appService.children.get('vc');

  const shareableVcs = useSelector(vcService, selectShareableVcs);

  const isLocationDisabled = useSelector(scanService, selectIsLocationDisabled);
  const isLocationDenied = useSelector(scanService, selectIsLocationDenied);
  const isBluetoothPermissionDenied = useSelector(
    scanService,
    selectIsBluetoothDenied
  );
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

    isEmpty: !shareableVcs.length,
    isBluetoothPermissionDenied,
    isLocationDisabled,
    isLocationDenied,
    isScanning: useSelector(scanService, selectIsScanning),
    isQrLogin: useSelector(scanService, selectIsShowQrLogin),
    isQrLoginstoring: useSelector(scanService, selectIsQrLoginStoring),
    isQrRef: useSelector(scanService, selectQrLoginRef),
    LOCATION_REQUEST: () => scanService.send(ScanEvents.LOCATION_REQUEST()),
    SCAN: (qrCode: string) => scanService.send(ScanEvents.SCAN(qrCode)),
  };
}
