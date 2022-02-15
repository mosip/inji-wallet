import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { ActorRefFrom } from 'xstate';
import { selectVidLabel } from '../../machines/settings';
import {
  selectIsRefreshingReceivedVids,
  selectReceivedVids,
} from '../../machines/vid';
import { vidItemMachine } from '../../machines/vidItem';
import { GlobalContext } from '../../shared/GlobalContext';
import { HomeScreenTabProps } from './HomeScreen';
import {
  ReceivedVidsTabEvents,
  ReceivedVidsTabMachine,
} from './ReceivedVidsTabMachine';

export function useReceivedVidsTab(props: HomeScreenTabProps) {
  const service = props.service as ActorRefFrom<typeof ReceivedVidsTabMachine>;
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');
  const vidService = appService.children.get('vid');

  return {
    vidLabel: useSelector(settingsService, selectVidLabel),
    vidKeys: useSelector(vidService, selectReceivedVids),

    isRefreshingVids: useSelector(vidService, selectIsRefreshingReceivedVids),

    VIEW_VID: (vidItemActor: ActorRefFrom<typeof vidItemMachine>) =>
      service.send(ReceivedVidsTabEvents.VIEW_VID(vidItemActor)),
    REFRESH: () => service.send(ReceivedVidsTabEvents.REFRESH()),
  };
}
