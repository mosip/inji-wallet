import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import {
  RequestEvents,
  selectAccepted,
  selectBluetoothDenied,
  selectConnectionParams,
  selectDisconnected,
  selectRejected,
  selectReviewing,
  selectSenderInfo,
  selectStatusMessage,
  selectWaitingForConnection,
} from '../../machines/request';
import { selectVidLabel } from '../../machines/settings';
import { MainRouteProps } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';

export function useRequestScreen({ navigation }: MainRouteProps) {
  const { appService } = useContext(GlobalContext);
  const requestService = appService.children.get('request');
  const settingsService = appService.children.get('settings');

  useEffect(() => {
    const subscriptions = [
      navigation.addListener('focus', () =>
        requestService.send(RequestEvents.SCREEN_FOCUS())
      ),
      navigation.addListener('blur', () =>
        requestService.send(RequestEvents.SCREEN_BLUR())
      ),
    ];

    const navSubscription = requestService.subscribe((state) => {
      if (state.matches('reviewing.navigatingToHome')) {
        navigation.navigate('Home', { activeTab: 1 });
      }
    });

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      navSubscription.unsubscribe();
    };
  }, []);

  return {
    connectionParams: useSelector(requestService, selectConnectionParams),
    statusMessage: useSelector(requestService, selectStatusMessage),
    senderInfo: useSelector(requestService, selectSenderInfo),
    vidLabel: useSelector(settingsService, selectVidLabel),

    isWaitingForConnection: useSelector(
      requestService,
      selectWaitingForConnection
    ),
    isBluetoothDenied: useSelector(requestService, selectBluetoothDenied),
    isReviewing: useSelector(requestService, selectReviewing),
    isAccepted: useSelector(requestService, selectAccepted),
    isRejected: useSelector(requestService, selectRejected),
    isDisconnected: useSelector(requestService, selectDisconnected),

    DISMISS: () => requestService.send(RequestEvents.DISMISS()),
    ACCEPT: () => requestService.send(RequestEvents.ACCEPT()),
    REJECT: () => requestService.send(RequestEvents.REJECT()),
  };
}
