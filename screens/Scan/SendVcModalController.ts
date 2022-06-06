import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import {
  ScanEvents,
  selectIsAccepted,
  selectReason,
  selectReceiverInfo,
  selectIsRejected,
  selectIsSelectingVc,
  selectIsSendingVc,
  selectVcName,
} from '../../machines/scan';
import { selectVcLabel } from '../../machines/settings';
import { selectShareableVcs } from '../../machines/vc';
import { GlobalContext } from '../../shared/GlobalContext';
import { VC } from '../../types/vc';

export function useSendVcModal() {
  const { appService } = useContext(GlobalContext);
  const scanService = appService.children.get('scan');
  const settingsService = appService.children.get('settings');
  const vcService = appService.children.get('vc');

  return {
    receiverInfo: useSelector(scanService, selectReceiverInfo),
    reason: useSelector(scanService, selectReason),
    vcName: useSelector(scanService, selectVcName),
    vcLabel: useSelector(settingsService, selectVcLabel),
    vcKeys: useSelector(vcService, selectShareableVcs),

    isSelectingVc: useSelector(scanService, selectIsSelectingVc),
    isSendingVc: useSelector(scanService, selectIsSendingVc),
    isAccepted: useSelector(scanService, selectIsAccepted),
    isRejected: useSelector(scanService, selectIsRejected),

    ACCEPT_REQUEST: () => scanService.send(ScanEvents.ACCEPT_REQUEST()),
    CANCEL: () => scanService.send(ScanEvents.CANCEL()),
    SELECT_VC: (vc: VC) => scanService.send(ScanEvents.SELECT_VC(vc)),
    DISMISS: () => scanService.send(ScanEvents.DISMISS()),
    UPDATE_REASON: (reason: string) =>
      scanService.send(ScanEvents.UPDATE_REASON(reason)),
    UPDATE_VC_NAME: (vcName: string) =>
      scanService.send(ScanEvents.UPDATE_VC_NAME(vcName)),
  };
}
