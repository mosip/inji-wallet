import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageOverlayProps } from '../../components/MessageOverlay';
import {
  ScanEvents,
  selectIsInvalid,
  selectIsLocationDisabled,
  selectIsLocationDenied,
  selectIsReviewing,
  selectIsScanning,
  selectIsConnecting,
  selectIsExchangingDeviceInfo,
  selectIsConnectingTimeout,
  selectIsExchangingDeviceInfoTimeout,
} from '../../machines/scan';
import { selectVcLabel } from '../../machines/settings';
import { selectShareableVcs } from '../../machines/vc';
import { MainRouteProps } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';

export function useScanScreen({ navigation }: MainRouteProps) {
  const { t } = useTranslation('ScanScreen');
  const { appService } = useContext(GlobalContext);
  const scanService = appService.children.get('scan');
  const settingsService = appService.children.get('settings');
  const vcService = appService.children.get('vc');

  const shareableVcs = useSelector(vcService, selectShareableVcs);

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

  const isInvalid = useSelector(scanService, selectIsInvalid);
  const isConnecting = useSelector(scanService, selectIsConnecting);
  const isConnectingTimeout = useSelector(
    scanService,
    selectIsConnectingTimeout
  );
  const isExchangingDeviceInfo = useSelector(
    scanService,
    selectIsExchangingDeviceInfo
  );
  const isExchangingDeviceInfoTimeout = useSelector(
    scanService,
    selectIsExchangingDeviceInfoTimeout
  );

  const onCancel = () => scanService.send(ScanEvents.CANCEL());
  let statusOverlay: Pick<
    MessageOverlayProps,
    'message' | 'hint' | 'onCancel'
  > = null;
  if (isConnecting) {
    statusOverlay = {
      message: t('status.connecting'),
    };
  } else if (isConnectingTimeout) {
    statusOverlay = {
      message: t('status.connecting'),
      hint: t('status.connectingTimeout'),
      onCancel,
    };
  } else if (isExchangingDeviceInfo) {
    statusOverlay = {
      message: t('status.exchangingDeviceInfo'),
    };
  } else if (isExchangingDeviceInfoTimeout) {
    statusOverlay = {
      message: t('status.exchangingDeviceInfo'),
      hint: t('status.exchangingDeviceInfoTimeout'),
      onCancel,
    };
  } else if (isInvalid) {
    statusOverlay = {
      message: t('status.invalid'),
    };
  }

  useEffect(() => {
    const subscriptions = [
      navigation.addListener('focus', () =>
        scanService.send(ScanEvents.SCREEN_FOCUS())
      ),
      navigation.addListener('blur', () =>
        scanService.send(ScanEvents.SCREEN_BLUR())
      ),
    ];

    const navSubscription = scanService.subscribe((state) => {
      if (state.matches('reviewing.navigatingToHome')) {
        navigation.navigate('Home', { activeTab: 0 });
      }
    });

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      navSubscription.unsubscribe();
    };
  }, []);

  return {
    locationError,
    vcLabel: useSelector(settingsService, selectVcLabel),

    isInvalid,
    isEmpty: !shareableVcs.length,
    isLocationDisabled,
    isLocationDenied,
    isScanning: useSelector(scanService, selectIsScanning),
    isReviewing: useSelector(scanService, selectIsReviewing),
    statusOverlay,

    DISMISS: () => scanService.send(ScanEvents.DISMISS()),
    LOCATION_REQUEST: () => scanService.send(ScanEvents.LOCATION_REQUEST()),
    SCAN: (qrCode: string) => scanService.send(ScanEvents.SCAN(qrCode)),
    DISMISS_INVALID: () =>
      isInvalid ? scanService.send(ScanEvents.DISMISS()) : null,
  };
}
