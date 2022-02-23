import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import {
  ScanEvents,
  selectClearingConnection,
  selectInvalid,
  selectLocationDenied,
  selectReviewing,
  selectScanning,
  selectStatusMessage,
} from '../../machines/scan';
import { selectVidLabel } from '../../machines/settings';
import { selectShareableVids } from '../../machines/vid';
import { MainRouteProps } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';

export function useScanScreen({ navigation }: MainRouteProps) {
  const { appService } = useContext(GlobalContext);
  const scanService = appService.children.get('scan');
  const settingsService = appService.children.get('settings');
  const vidService = appService.children.get('vid');

  const shareableVids = useSelector(vidService, selectShareableVids);
  const isInvalid = useSelector(scanService, selectInvalid);

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
    statusMessage: useSelector(scanService, selectStatusMessage),
    vidLabel: useSelector(settingsService, selectVidLabel),

    onDismissInvalid: () => {
      if (isInvalid) {
        DISMISS();
      }
    },

    isInvalid,
    isEmpty: !shareableVids.length,
    isScanning: useSelector(scanService, selectScanning),
    isReviewing: useSelector(scanService, selectReviewing),
    isLocationDenied: useSelector(scanService, selectLocationDenied),
    isClearingConnection: useSelector(scanService, selectClearingConnection),

    DISMISS,
    REQUEST,
    SCAN: (qrCode: string) => scanService.send(ScanEvents.SCAN(qrCode)),
  };

  function DISMISS() {
    scanService.send(ScanEvents.DISMISS());
  }

  function REQUEST() {
    scanService.send(ScanEvents.LOCATION_REQUEST());
  }
}
