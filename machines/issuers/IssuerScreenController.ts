import {
  IssuerModelEvents,
  IssuersMachine,
  selectDisplayIssuers,
  selectIssuers,
  selectPerformAuthorization,
  selectSelectedIssuers,
  selectSelectingIssuers,
} from './issuersMachine';
import { ActorRefFrom } from 'xstate';
import { selectIssuerMachine } from '../../screens/Home/MyVcsTabMachine';
import { useSelector } from '@xstate/react';

export function useIssuerService({ service }) {
  return {
    issuers: useSelector(service, selectIssuers),
    selectIssuerMachine: useSelector(service, selectIssuerMachine),
    isPerformAuthorization: useSelector(service, selectPerformAuthorization),
    isSelectingIssuers: useSelector(service, selectSelectingIssuers),
    isSelectedIssuer: useSelector(service, selectSelectedIssuers),
    isDisplayIssuers: useSelector(service, selectDisplayIssuers),
    DISMISS: () => service.send(IssuerModelEvents.DISMISS()),
    DOWNLOAD_ID: () => service.send(IssuerModelEvents.DOWNLOAD_ID()),
    SELECTED_ISSUER: (id) =>
      service.send(IssuerModelEvents.SELECTED_ISSUER(id)),
  };
}

export interface IssuerModelProps {
  service: ActorRefFrom<typeof IssuersMachine>;
  onPress?: () => void;
  isVisible?: boolean;
  onDismiss?: () => void;
}
