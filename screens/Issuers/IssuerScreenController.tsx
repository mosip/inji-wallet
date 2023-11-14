import {useSelector} from '@xstate/react';
import {
  IssuerScreenTabEvents,
  IssuersMachine,
  selectErrorMessageType,
  selectIsDone,
  selectIsDownloadCredentials,
  selectIsIdle,
  selectIssuers,
  selectLoadingReason,
  selectStoring,
} from '../../machines/issuersMachine';
import {ActorRefFrom} from 'xstate';
import {BOTTOM_TAB_ROUTES} from '../../routes/routesConstants';

export function useIssuerScreenController({route, navigation}) {
  const service = route.params.service;

  return {
    issuers: useSelector(service, selectIssuers),
    errorMessageType: useSelector(service, selectErrorMessageType),
    isDownloadingCredentials: useSelector(service, selectIsDownloadCredentials),
    isDone: useSelector(service, selectIsDone),
    isIdle: useSelector(service, selectIsIdle),
    loadingReason: useSelector(service, selectLoadingReason),
    isStoring: useSelector(service, selectStoring),

    CANCEL: () => service.send(IssuerScreenTabEvents.CANCEL()),
    SELECTED_ISSUER: id =>
      service.send(IssuerScreenTabEvents.SELECTED_ISSUER(id)),
    DISMISS: () => service.send(IssuerScreenTabEvents.DISMISS()),
    TRY_AGAIN: () => service.send(IssuerScreenTabEvents.TRY_AGAIN()),
    RESET_ERROR: () => service.send(IssuerScreenTabEvents.RESET_ERROR()),
    DOWNLOAD_ID: () => {
      service.send(IssuerScreenTabEvents.DOWNLOAD_ID());
      navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'});
    },
  };
}

export interface IssuerModalProps {
  service?: ActorRefFrom<typeof IssuersMachine>;
  onPress?: () => void;
  isVisible?: boolean;
}
