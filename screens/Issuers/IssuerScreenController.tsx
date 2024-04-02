import {useSelector} from '@xstate/react';
import {
  IssuerScreenTabEvents,
  IssuersMachine,
  selectErrorMessageType,
  selectIsBiometricCancelled,
  selectIsDone,
  selectIsDownloadCredentials,
  selectIsIdle,
  selectIssuers,
  selectLoadingReason,
  selectStoring,
  selectVerificationErrorMessage,
} from '../../machines/issuersMachine';
import {ActorRefFrom} from 'xstate';
import {BOTTOM_TAB_ROUTES} from '../../routes/routesConstants';
import {logState} from '../../shared/commonUtil';
import {isAndroid} from '../../shared/constants';

export function useIssuerScreenController({route, navigation}) {
  const service = route.params.service;
  service.subscribe(logState);

  return {
    issuers: useSelector(service, selectIssuers),
    errorMessageType: useSelector(service, selectErrorMessageType),
    isDownloadingCredentials: useSelector(service, selectIsDownloadCredentials),
    isBiometricsCancelled: useSelector(service, selectIsBiometricCancelled),
    isDone: useSelector(service, selectIsDone),
    isIdle: useSelector(service, selectIsIdle),
    loadingReason: useSelector(service, selectLoadingReason),
    isStoring: useSelector(service, selectStoring),
    verificationErrorMessage: useSelector(
      service,
      selectVerificationErrorMessage,
    ),

    CANCEL: () => service.send(IssuerScreenTabEvents.CANCEL()),
    SELECTED_ISSUER: id =>
      service.send(IssuerScreenTabEvents.SELECTED_ISSUER(id)),
    TRY_AGAIN: () => service.send(IssuerScreenTabEvents.TRY_AGAIN()),
    RESET_ERROR: () => service.send(IssuerScreenTabEvents.RESET_ERROR()),
    DOWNLOAD_ID: () => {
      service.send(IssuerScreenTabEvents.DOWNLOAD_ID());
      navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'});
    },
    RESET_VERIFY_ERROR: () => {
      service.send(IssuerScreenTabEvents.RESET_VERIFY_ERROR());
      if (isAndroid()) {
        navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'});
      } else {
        setTimeout(
          () =>
            navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'}),
          0,
        );
      }
    },
  };
}

export interface IssuerModalProps {
  service?: ActorRefFrom<typeof IssuersMachine>;
  onPress?: () => void;
  isVisible?: boolean;
}
