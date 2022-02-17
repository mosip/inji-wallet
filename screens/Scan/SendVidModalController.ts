import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import {
  ScanEvents,
  selectAccepted,
  selectReason,
  selectReceiverInfo,
  selectRejected,
  selectSelectingVid,
  selectSendingVid,
  selectVidName,
} from '../../machines/scan';
import { selectVidLabel } from '../../machines/settings';
import { selectShareableVids } from '../../machines/vid';
import { GlobalContext } from '../../shared/GlobalContext';
import { VID } from '../../types/vid';

export function useSendVidModal() {
  const { appService } = useContext(GlobalContext);
  const scanService = appService.children.get('scan');
  const settingsService = appService.children.get('settings');
  const vidService = appService.children.get('vid');

  return {
    receiverInfo: useSelector(scanService, selectReceiverInfo),
    reason: useSelector(scanService, selectReason),
    vidName: useSelector(scanService, selectVidName),
    vidLabel: useSelector(settingsService, selectVidLabel),
    vidKeys: useSelector(vidService, selectShareableVids),

    isSelectingVid: useSelector(scanService, selectSelectingVid),
    isSendingVid: useSelector(scanService, selectSendingVid),
    isAccepted: useSelector(scanService, selectAccepted),
    isRejected: useSelector(scanService, selectRejected),

    ACCEPT_REQUEST: () => scanService.send(ScanEvents.ACCEPT_REQUEST()),
    CANCEL: () => scanService.send(ScanEvents.CANCEL()),
    SELECT_VID: (vid: VID) => scanService.send(ScanEvents.SELECT_VID(vid)),
    DISMISS: () => scanService.send(ScanEvents.DISMISS()),
    UPDATE_REASON: (reason: string) =>
      scanService.send(ScanEvents.UPDATE_REASON(reason)),
    UPDATE_VID_NAME: (vidName: string) =>
      scanService.send(ScanEvents.UPDATE_VID_NAME(vidName)),
  };
}
