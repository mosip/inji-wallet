import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { ActorRefFrom } from 'xstate';
import { selectVidLabel } from '../../machines/settings';
import {
  selectIsRefreshingMyVids,
  selectMyVids,
  VidEvents,
} from '../../machines/vid';
import { vidItemMachine } from '../../machines/vidItem';
import { GlobalContext } from '../../shared/GlobalContext';
import { HomeScreenTabProps } from './HomeScreen';
import {
  MyVidsTabEvents,
  MyVidsTabMachine,
  selectAddVidModal,
  selectIsOnboarding,
} from './MyVidsTabMachine';

export function useMyVidsTab(props: HomeScreenTabProps) {
  const service = props.service as ActorRefFrom<typeof MyVidsTabMachine>;
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');
  const vidService = appService.children.get('vid');

  return {
    service,
    AddVidModalService: useSelector(service, selectAddVidModal),

    vidKeys: useSelector(vidService, selectMyVids),
    vidLabel: useSelector(settingsService, selectVidLabel),

    isRefreshingVids: useSelector(vidService, selectIsRefreshingMyVids),
    isOnboarding: useSelector(service, selectIsOnboarding),

    DISMISS: () => service.send(MyVidsTabEvents.DISMISS()),

    ADD_VID: () => service.send(MyVidsTabEvents.ADD_VID()),

    REFRESH: () => vidService.send(VidEvents.REFRESH_MY_VIDS()),

    VIEW_VID: (vidRef: ActorRefFrom<typeof vidItemMachine>) => {
      return service.send(MyVidsTabEvents.VIEW_VID(vidRef));
    },

    ONBOARDING_DONE: () => service.send(MyVidsTabEvents.ONBOARDING_DONE()),
  };
}
