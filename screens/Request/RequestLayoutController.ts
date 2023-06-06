import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import {
  RequestEvents,
  selectIsAccepted,
  selectIsDisconnected,
  selectIsDone,
  selectIsRejected,
  selectIsReviewing,
  selectIsWaitingForConnection,
  selectSenderInfo,
} from '../../machines/request';
import { MainBottomTabParamList } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';
import { selectIsHandlingBleError } from '../../machines/openIdBle/scan';
import {
  selectBleError,
  selectIsSavingFailedInViewingVc,
} from '../../machines/openIdBle/request';

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
