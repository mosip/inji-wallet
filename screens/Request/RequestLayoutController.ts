import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useSelector} from '@xstate/react';
import {useContext, useEffect} from 'react';

import {MainBottomTabParamList} from '../../routes/main';
import {GlobalContext} from '../../shared/GlobalContext';
import {
  selectIsSavingFailedInViewingVc,
  selectIsWaitingForConnection,
  selectSenderInfo,
  selectIsDone,
  selectIsNavigatingToReceivedCards,
  selectIsNavigatingToHome,
} from '../../machines/bleShare/request/selectors';
import {
  selectIsAccepted,
  selectIsDisconnected,
  selectIsHandlingBleError,
  selectIsRejected,
  selectIsReviewing,
  selectBleError,
} from '../../machines/bleShare/commonSelectors';
import {RequestEvents} from '../../machines/bleShare/request/requestMachine';
import {
  BOTTOM_TAB_ROUTES,
  REQUEST_ROUTES,
  RequestStackParamList,
} from '../../routes/routesConstants';
import {useTranslation} from 'react-i18next';

type RequestLayoutNavigation = NavigationProp<
  RequestStackParamList & MainBottomTabParamList
>;

export function useRequestLayout() {
  const {t} = useTranslation('RequestScreen');
  const {appService} = useContext(GlobalContext);
  const requestService = appService.children.get('request');
  const navigation = useNavigation<RequestLayoutNavigation>();
  let errorScenario: {title: ''; message: ''};

  useEffect(() => {
    const subscriptions = [
      navigation.addListener('focus', () =>
        requestService.send(RequestEvents.SCREEN_FOCUS()),
      ),
      navigation.addListener('blur', () =>
        requestService.send(RequestEvents.SCREEN_BLUR()),
      ),
    ];

    return () => {
      subscriptions.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  const isReviewing = useSelector(requestService, selectIsReviewing);
  const isDone = useSelector(requestService, selectIsDone);
  const isWaitingForConnection = useSelector(
    requestService,
    selectIsWaitingForConnection,
  );
  const isNavigatingToReceivedCards = useSelector(
    requestService,
    selectIsNavigatingToReceivedCards,
  );
  const isNavigationToHome = useSelector(
    requestService,
    selectIsNavigatingToHome,
  );
  const isDisconnected = useSelector(requestService, selectIsDisconnected);
  const isBleError = useSelector(requestService, selectIsHandlingBleError);
  const isErrorCode = useSelector(requestService, selectBleError);

  if (isDisconnected) {
    errorScenario = {
      title: t(`status.disconnected.title`),
      message: t(`status.disconnected.message`),
    };
  } else if (isBleError) {
    errorScenario = {
      title: t(`status.bleError.${isErrorCode.code}.title`),
      message: t(`status.bleError.${isErrorCode.code}.message`),
    };
  }

  useEffect(() => {
    if (isNavigationToHome) {
      navigation.navigate(BOTTOM_TAB_ROUTES.home);
    } else if (isReviewing) {
      navigation.navigate(REQUEST_ROUTES.ReceiveVcScreen);
    } else if (isWaitingForConnection) {
      navigation.navigate(REQUEST_ROUTES.RequestScreen);
    }
  }, [isNavigationToHome, isReviewing, isWaitingForConnection]);

  return {
    senderInfo: useSelector(requestService, selectSenderInfo),

    isAccepted: useSelector(requestService, selectIsAccepted),
    isRejected: useSelector(requestService, selectIsRejected),
    isDisconnected,
    errorScenario,
    isBleError,
    IsSavingFailedInViewingVc: useSelector(
      requestService,
      selectIsSavingFailedInViewingVc,
    ),
    isReviewing,
    isDone,
    isNavigatingToReceivedCards,
    DISMISS: () => requestService.send(RequestEvents.DISMISS()),
    RESET: () => requestService.send(RequestEvents.RESET()),
  };
}
