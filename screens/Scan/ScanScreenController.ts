import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScanEvents,
  selectInvalid,
  selectIsAirplaneEnabled,
  selectIsLocationDisabled,
  selectIsLocationDenied,
  selectReviewing,
  selectScanning,
  selectStatusMessage,
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
  const isInvalid = useSelector(scanService, selectInvalid);

  const isLocationDisabled = useSelector(scanService, selectIsLocationDisabled);
  const isLocationDenied = useSelector(scanService, selectIsLocationDenied);
  const isFlightMode = useSelector(scanService, selectIsAirplaneEnabled);

  const locationError = { message: '', button: '' };
  if (isFlightMode) {
    locationError.message = t('errors.flightMode.message');
    locationError.button = t('errors.flightMode.button');
  } else {
    if (isLocationDisabled) {
      locationError.message = t('errors.locationDisabled.message');
      locationError.button = t('errors.locationDisabled.button');
    } else if (isLocationDenied) {
      locationError.message = t('errors.locationDenied.message');
      locationError.button = t('errors.locationDenied.button');
    }
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
    statusMessage: useSelector(scanService, selectStatusMessage),
    vcLabel: useSelector(settingsService, selectVcLabel),

    isInvalid,
    isEmpty: !shareableVcs.length,
    isLocationDisabled,
    isLocationDenied,
    isScanning: useSelector(scanService, selectScanning),
    isReviewing: useSelector(scanService, selectReviewing),
    isFlightMode,

    DISMISS: () => scanService.send(ScanEvents.DISMISS()),
    ON_REQUEST: () =>
      isFlightMode
        ? scanService.send(ScanEvents.FLIGHT_REQUEST())
        : scanService.send(ScanEvents.LOCATION_REQUEST()),
    SCAN: (qrCode: string) => scanService.send(ScanEvents.SCAN(qrCode)),
    DISMISS_INVALID: () => {
      if (isInvalid) {
        scanService.send(ScanEvents.DISMISS());
      }
    },
  };
}
