import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import {
  RequestEvents,
  selectIncomingVc,
  selectIsIncomingVp,
  selectIsInvalidIdentity,
  selectIsReviewingInIdle,
  selectIsVerifyingIdentity,
  selectSenderInfo,
} from '../../machines/request';
import { selectVcLabel } from '../../machines/settings';
import { GlobalContext } from '../../shared/GlobalContext';

export function useReceiveVcScreen() {
  const { appService } = useContext(GlobalContext);
  const requestService = appService.children.get('request');
  const settingsService = appService.children.get('settings');

  return {
    senderInfo: useSelector(requestService, selectSenderInfo),
    incomingVc: useSelector(requestService, selectIncomingVc),
    vcLabel: useSelector(settingsService, selectVcLabel),

    isIncomingVp: useSelector(requestService, selectIsIncomingVp),
    isReviewingInIdle: useSelector(requestService, selectIsReviewingInIdle),
    isVerifyingIdentity: useSelector(requestService, selectIsVerifyingIdentity),
    isInvalidIdentity: useSelector(requestService, selectIsInvalidIdentity),

    ACCEPT: () => requestService.send(RequestEvents.ACCEPT()),
    ACCEPT_AND_VERIFY: () =>
      requestService.send(RequestEvents.ACCEPT_AND_VERIFY()),
    REJECT: () => requestService.send(RequestEvents.REJECT()),
    RETRY_VERIFICATION: () =>
      requestService.send(RequestEvents.RETRY_VERIFICATION()),
    CANCEL: () => requestService.send(RequestEvents.CANCEL()),
    DISMISS: () => requestService.send(RequestEvents.DISMISS()),
    FACE_VALID: () => requestService.send(RequestEvents.FACE_VALID()),
    FACE_INVALID: () => requestService.send(RequestEvents.FACE_INVALID()),
  };
}
