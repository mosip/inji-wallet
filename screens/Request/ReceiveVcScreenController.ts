import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import {
  RequestEvents,
  selectIncomingVc,
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

    ACCEPT: () => requestService.send(RequestEvents.ACCEPT()),
    REJECT: () => requestService.send(RequestEvents.REJECT()),
  };
}
