import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectIncomingVid, selectSenderInfo } from '../../machines/request';
import { selectVidLabel } from '../../machines/settings';
import { GlobalContext } from '../../shared/GlobalContext';

export function useReceiveVidModal() {
  const { appService } = useContext(GlobalContext);
  const requestService = appService.children.get('request');
  const settingsService = appService.children.get('settings');

  return {
    senderInfo: useSelector(requestService, selectSenderInfo),
    incomingVid: useSelector(requestService, selectIncomingVid),
    vidLabel: useSelector(settingsService, selectVidLabel),
  };
}
