import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';

import { MainBottomTabParamList } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';
import {
  selectIsSavingFailedInViewingVc,
  selectIsWaitingForConnection,
  selectSenderInfo,
} from '../../machines/bleShare/request/selectors';
import {
  selectIsAccepted,
  selectIsDisconnected,
  selectIsDone,
  selectIsHandlingBleError,
  selectIsRejected,
  selectIsReviewing,
  selectBleError,
} from '../../machines/bleShare/commonSelectors';
import { RequestEvents } from '../../machines/bleShare/request/requestMachine';

type RequestStackParamList = {
  RequestScreen: undefined;
  ReceiveVcScreen: undefined;
};

type RequestLayoutNavigation = NavigationProp<
  RequestStackParamList & MainBottomTabParamList
>;

export function useRequestLayout() {
  const { appService } = useContext(GlobalContext);
  const requestService = appService.children.get('request');
  const navigation = useNavigation<RequestLayoutNavigation>();

  useEffect(() => {
    const subscriptions = [
      navigation.addListener('focus', () =>
        requestService.send(RequestEvents.SCREEN_FOCUS())
      ),
      navigation.addListener('blur', () =>
        requestService.send(RequestEvents.SCREEN_BLUR())
      ),
    ];

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const isReviewing = useSelector(requestService, selectIsReviewing);
  const isDone = useSelector(requestService, selectIsDone);
  const isWaitingForConnection = useSelector(
    requestService,
    selectIsWaitingForConnection
  );
  useEffect(() => {
    if (isDone) {
      navigation.navigate('Home', { activeTab: 1 });
    } else if (isReviewing) {
      navigation.navigate('ReceiveVcScreen');
    } else if (isWaitingForConnection) {
      navigation.navigate('RequestScreen');
    }
  }, [isDone, isReviewing, isWaitingForConnection]);

  return {
    senderInfo: useSelector(requestService, selectSenderInfo),

    isAccepted: useSelector(requestService, selectIsAccepted),
    isRejected: useSelector(requestService, selectIsRejected),
    isDisconnected: useSelector(requestService, selectIsDisconnected),
    isBleError: useSelector(requestService, selectIsHandlingBleError),
    bleError: useSelector(requestService, selectBleError),

    IsSavingFailedInViewingVc: useSelector(
      requestService,
      selectIsSavingFailedInViewingVc
    ),
    isReviewing,
    isDone,

    DISMISS: () => requestService.send(RequestEvents.DISMISS()),
    RESET: () => requestService.send(RequestEvents.RESET()),
  };
}
