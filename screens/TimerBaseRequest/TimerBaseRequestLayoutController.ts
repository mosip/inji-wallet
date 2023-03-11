import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import {
  TimerBaseRequestEvents,
  selectIsAccepted,
  selectIsDisconnected,
  selectIsDone,
  selectIsRejected,
  selectIsReviewing,
  selectIsWaitingForConnection,
  selectSenderInfo,
} from '../../machines/TimerBaseRequest';
import { selectVcLabel } from '../../machines/settings';
import { MainBottomTabParamList } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';

type RequestStackParamList = {
  TimerBaseRequestScreen: undefined;
  TimerBaseReceiveVcScreen: undefined;
};

type RequestLayoutNavigation = NavigationProp<
  RequestStackParamList & MainBottomTabParamList
>;

export function useRequestLayout() {
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');
  const requestService = appService.children.get('timerBaseRequest');
  const navigation = useNavigation<RequestLayoutNavigation>();
  const isReviewing = useSelector(requestService, selectIsReviewing);
  const isDone = useSelector(requestService, selectIsDone);
  const isWaitingForConnection = useSelector(
    requestService,
    selectIsWaitingForConnection
  );
  const isAccepted = useSelector(requestService, selectIsAccepted);

  useEffect(() => {
    const subscriptions = [
      navigation.addListener('focus', () =>
        requestService.send(TimerBaseRequestEvents.SCREEN_FOCUS())
      ),
      navigation.addListener('blur', () =>
        requestService.send(TimerBaseRequestEvents.SCREEN_BLUR())
      ),
    ];

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }, [isDone]);

  useEffect(() => {
    if (isAccepted) {
      navigation.navigate('TimerBaseRequestScreen');
    } else if (isReviewing) {
      navigation.navigate('TimerBaseReceiveVcScreen');
    } else if (isWaitingForConnection) {
      navigation.navigate('TimerBaseRequestScreen');
    }
  }, [isDone, isReviewing, isAccepted]);

  return {
    vcLabel: useSelector(settingsService, selectVcLabel),
    senderInfo: useSelector(requestService, selectSenderInfo),

    isAccepted: useSelector(requestService, selectIsAccepted),
    isRejected: useSelector(requestService, selectIsRejected),
    isDisconnected: useSelector(requestService, selectIsDisconnected),
    isReviewing,
    isDone,

    DISMISS: () => requestService.send(TimerBaseRequestEvents.DISMISS()),
  };
}
