import { useSelector } from '@xstate/react';
import { useContext, useState } from 'react';
import { ActorRefFrom } from 'xstate';
import { selectVcLabel } from '../../machines/settings';
import {
  selectIsRefreshingReceivedVcs,
  selectReceivedVcs,
} from '../../machines/vc';
import { vcItemMachine } from '../../machines/vcItem';
import { GlobalContext } from '../../shared/GlobalContext';
import { HomeScreenTabProps } from './HomeScreen';
import {
  ReceivedVcsTabEvents,
  ReceivedVcsTabMachine,
} from './ReceivedVcsTabMachine';

export function useReceivedVcsTab(props: HomeScreenTabProps) {
  const service = props.service as ActorRefFrom<typeof ReceivedVcsTabMachine>;
  const { appService } = useContext(GlobalContext);
  const [isVisible, setIsVisible] = useState(false);
  const settingsService = appService.children.get('settings');
  const vcService = appService.children.get('vc');

  return {
    isVisible,
    vcLabel: useSelector(settingsService, selectVcLabel),
    vcKeys: useSelector(vcService, selectReceivedVcs),

    isRefreshingVcs: useSelector(vcService, selectIsRefreshingReceivedVcs),

    TOGGLE_RECEIVED_CARDS: () => setIsVisible(!isVisible),

    VIEW_VC: (vcItemActor: ActorRefFrom<typeof vcItemMachine>) =>
      service.send(ReceivedVcsTabEvents.VIEW_VC(vcItemActor)),
    REFRESH: () => service.send(ReceivedVcsTabEvents.REFRESH()),
  };
}
