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
import { selectVcLabel } from '../../machines/settings';
import { MainBottomTabParamList } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';

type RequestStackParamList = {
  RequestScreen: undefined;
  ReceiveVcScreen: undefined;
};

type RequestLayoutNavigation = NavigationProp<
  RequestStackParamList & MainBottomTabParamList
>;

export function useRequestLayout() {
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');
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
    vcLabel: useSelector(settingsService, selectVcLabel),
    senderInfo: useSelector(requestService, selectSenderInfo),

    isAccepted: useSelector(requestService, selectIsAccepted),
    isRejected: useSelector(requestService, selectIsRejected),
    isDisconnected: useSelector(requestService, selectIsDisconnected),
    isReviewing,
    isDone,

    DISMISS: () => requestService.send(RequestEvents.DISMISS()),
  };
}
