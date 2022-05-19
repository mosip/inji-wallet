import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SystemSetting from 'react-native-system-setting';
import {
  ScanEvents,
  selectIsInvalid,
  selectIsAirplaneEnabled,
  selectIsLocationDisabled,
  selectIsLocationDenied,
  selectIsReviewing,
  selectIsScanning,
  selectIsConnecting,
  selectIsExchangingDeviceInfo,
} from '../../machines/scan';
import { selectVcLabel } from '../../machines/settings';
import { selectShareableVcs } from '../../machines/vc';
import { selectIsActive } from '../../machines/app';
import { MainRouteProps } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';

export function useScanScreen({ navigation }: MainRouteProps) {
  const { t } = useTranslation('ScanScreen');
  const { appService } = useContext(GlobalContext);
  const scanService = appService.children.get('scan');
  const settingsService = appService.children.get('settings');
  const vcService = appService.children.get('vc');
  const isActive = useSelector(appService, selectIsActive);

  const shareableVcs = useSelector(vcService, selectShareableVcs);

  const isLocationDisabled = useSelector(scanService, selectIsLocationDisabled);
  const isLocationDenied = useSelector(scanService, selectIsLocationDenied);
  const isFlightMode = useSelector(scanService, selectIsAirplaneEnabled);

  const locationError = { message: '', button: '' };
  if (isFlightMode) {
    locationError.message = t('errors.flightMode.message');
    locationError.button = t('errors.flightMode.button');
  } else if (isLocationDisabled) {
    locationError.message = t('errors.locationDisabled.message');
    locationError.button = t('errors.locationDisabled.button');
  } else if (isLocationDenied) {
    locationError.message = t('errors.locationDenied.message');
    locationError.button = t('errors.locationDenied.button');
  }

  const isInvalid = useSelector(scanService, selectIsInvalid);
  const isConnecting = useSelector(scanService, selectIsConnecting);
  const isExchangingDeviceInfo = useSelector(
    scanService,
    selectIsExchangingDeviceInfo
  );

  let statusMessage = '';
  if (isConnecting) {
    statusMessage = t('status.connecting');
  } else if (isExchangingDeviceInfo) {
    statusMessage = t('status.exchangingDeviceInfo');
  } else if (isInvalid) {
    statusMessage = t('status.invalid');
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

  useEffect(() => {
    SystemSetting.isAirplaneEnabled().then((enable) => {
      enable
        ? scanService.send(ScanEvents.FLIGHT_ENABLED())
        : scanService.send(ScanEvents.FLIGHT_DISABLED());
    });
  }, [isActive]);

  return {
    locationError,
    vcLabel: useSelector(settingsService, selectVcLabel),

    isInvalid,
    isEmpty: !shareableVcs.length,
    isLocationDisabled,
    isLocationDenied,
    isScanning: useSelector(scanService, selectIsScanning),
    isReviewing: useSelector(scanService, selectIsReviewing),
    isFlightMode,
    statusMessage,

    DISMISS: () => scanService.send(ScanEvents.DISMISS()),
    ON_REQUEST: () =>
      isFlightMode
        ? scanService.send(ScanEvents.FLIGHT_REQUEST())
        : scanService.send(ScanEvents.LOCATION_REQUEST()),
    SCAN: (qrCode: string) => scanService.send(ScanEvents.SCAN(qrCode)),
    DISMISS_INVALID: () => scanService.send(ScanEvents.DISMISS()),
  };
}
