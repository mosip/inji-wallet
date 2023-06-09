import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { GlobalContext } from '../../shared/GlobalContext';
import {
  selectIncomingVc,
  selectIsAccepting,
  selectIsIncomingVp,
  selectIsReviewingInIdle,
  selectIsSavingFailedInIdle,
  selectSenderInfo,
  selectStoreError,
} from '../../machines/bleShare/request/selectors';
import {
  selectIsInvalidIdentity,
  selectIsVerifyingIdentity,
} from '../../machines/bleShare/commonSelectors';
import { RequestEvents } from '../../machines/bleShare/request/requestMachine';

export function useReceiveVcScreen() {
  const { appService } = useContext(GlobalContext);
  const requestService = appService.children.get('request');

  return {
    senderInfo: useSelector(requestService, selectSenderInfo),
    incomingVc: useSelector(requestService, selectIncomingVc),

    isIncomingVp: useSelector(requestService, selectIsIncomingVp),
    isReviewingInIdle: useSelector(requestService, selectIsReviewingInIdle),
    isAccepting: useSelector(requestService, selectIsAccepting),
    IsSavingFailedInIdle: useSelector(
      requestService,
      selectIsSavingFailedInIdle
    ),
    isVerifyingIdentity: useSelector(requestService, selectIsVerifyingIdentity),
    isInvalidIdentity: useSelector(requestService, selectIsInvalidIdentity),

    storeError: useSelector(requestService, selectStoreError),

    ACCEPT: () => requestService.send(RequestEvents.ACCEPT()),
    ACCEPT_AND_VERIFY: () =>
      requestService.send(RequestEvents.ACCEPT_AND_VERIFY()),
    REJECT: () => requestService.send(RequestEvents.REJECT()),
    GO_TO_RECEIVED_VC_TAB: () =>
      requestService.send(RequestEvents.GO_TO_RECEIVED_VC_TAB()),
    RETRY_VERIFICATION: () =>
      requestService.send(RequestEvents.RETRY_VERIFICATION()),
    CANCEL: () => requestService.send(RequestEvents.CANCEL()),
    DISMISS: () => requestService.send(RequestEvents.DISMISS()),
    FACE_VALID: () => requestService.send(RequestEvents.FACE_VALID()),
    FACE_INVALID: () => requestService.send(RequestEvents.FACE_INVALID()),
  };
}
