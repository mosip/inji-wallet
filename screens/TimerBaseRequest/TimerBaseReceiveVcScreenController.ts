import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import {
  TimerBaseRequestEvents,
  selectIncomingVc,
  selectIsIncomingVp,
  selectIsInvalidIdentity,
  selectIsVerifyingIdentity,
  selectSenderInfo,
} from '../../machines/TimerBaseRequest';
import { selectVcLabel } from '../../machines/settings';
import { GlobalContext } from '../../shared/GlobalContext';

export function useReceiveVcScreen() {
  const { appService } = useContext(GlobalContext);
  const requestService = appService.children.get('timerBaseRequest');
  const settingsService = appService.children.get('settings');

  return {
    senderInfo: useSelector(requestService, selectSenderInfo),
    incomingVc: useSelector(requestService, selectIncomingVc),
    vcLabel: useSelector(settingsService, selectVcLabel),

    isIncomingVp: useSelector(requestService, selectIsIncomingVp),
    isVerifyingIdentity: useSelector(requestService, selectIsVerifyingIdentity),
    isInvalidIdentity: useSelector(requestService, selectIsInvalidIdentity),

    ACCEPT: () => requestService.send(TimerBaseRequestEvents.ACCEPT()),
    ACCEPT_AND_VERIFY: () =>
      requestService.send(TimerBaseRequestEvents.ACCEPT_AND_VERIFY()),
    REJECT: () => requestService.send(TimerBaseRequestEvents.REJECT()),
    RETRY_VERIFICATION: () =>
      requestService.send(TimerBaseRequestEvents.RETRY_VERIFICATION()),
    CANCEL: () => requestService.send(TimerBaseRequestEvents.CANCEL()),
    DISMISS: () => requestService.send(TimerBaseRequestEvents.DISMISS()),
    FACE_VALID: () => requestService.send(TimerBaseRequestEvents.FACE_VALID()),
    FACE_INVALID: () =>
      requestService.send(TimerBaseRequestEvents.FACE_INVALID()),
  };
}
