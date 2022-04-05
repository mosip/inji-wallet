import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { ActorRefFrom } from 'xstate';
import { selectVcLabel } from '../../machines/settings';
import {
  selectIsRefreshingMyVcs,
  selectMyVcs,
  VcEvents,
} from '../../machines/vc';
import {  vcItemMachine } from '../../machines/vcItem';
import { GlobalContext } from '../../shared/GlobalContext';
import { HomeScreenTabProps } from './HomeScreen';
import {
  MyVcsTabEvents,
  MyVcsTabMachine,
  selectAddVcModal,
  selectIsOnboarding,
  selectIsRequestSuccessful,
} from './MyVcsTabMachine';

export function useMyVcsTab(props: HomeScreenTabProps) {
  const service = props.service as ActorRefFrom<typeof MyVcsTabMachine>;
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');
  const vcService = appService.children.get('vc');

  return {
    service,
    AddVcModalService: useSelector(service, selectAddVcModal),

    vcKeys: useSelector(vcService, selectMyVcs),
    vcLabel: useSelector(settingsService, selectVcLabel),

    isRefreshingVcs: useSelector(vcService, selectIsRefreshingMyVcs),
    isRequestSuccessful: useSelector(service, selectIsRequestSuccessful),
    isOnboarding: useSelector(service, selectIsOnboarding),

    DISMISS: () => service.send(MyVcsTabEvents.DISMISS()),

    ADD_VC: () => service.send(MyVcsTabEvents.ADD_VC()),

    REFRESH: () => vcService.send(VcEvents.REFRESH_MY_VCS()),

    VIEW_VC: (vcRef: ActorRefFrom<typeof  vcItemMachine>) => {
      return service.send(MyVcsTabEvents.VIEW_VC(vcRef));
    },

    ONBOARDING_DONE: () => service.send(MyVcsTabEvents.ONBOARDING_DONE()),
  };
}
