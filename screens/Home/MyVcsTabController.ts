import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { ActorRefFrom } from 'xstate';
import {
  selectIsRefreshingMyVcs,
  selectMyVcs,
  VcEvents,
} from '../../machines/vc';
import { vcItemMachine } from '../../machines/vcItem';
import { GlobalContext } from '../../shared/GlobalContext';
import { HomeScreenTabProps } from './HomeScreen';
import {
  MyVcsTabEvents,
  MyVcsTabMachine,
  selectAddVcModal,
  selectIsOnboarding,
  selectIsRequestSuccessful,
  selectGetVcModal,
  selectStoreError,
  selectIsSavingFailedInIdle,
} from './MyVcsTabMachine';

export function useMyVcsTab(props: HomeScreenTabProps) {
  const service = props.service as ActorRefFrom<typeof MyVcsTabMachine>;
  const { appService } = useContext(GlobalContext);
  const vcService = appService.children.get('vc');

  return {
    service,
    AddVcModalService: useSelector(service, selectAddVcModal),
    GetVcModalService: useSelector(service, selectGetVcModal),

    vcKeys: useSelector(vcService, selectMyVcs),

    isRefreshingVcs: useSelector(vcService, selectIsRefreshingMyVcs),
    isRequestSuccessful: useSelector(service, selectIsRequestSuccessful),
    isOnboarding: useSelector(service, selectIsOnboarding),
    storeError: useSelector(service, selectStoreError),
    isSavingFailedInIdle: useSelector(service, selectIsSavingFailedInIdle),

    DISMISS: () => service.send(MyVcsTabEvents.DISMISS()),

    ADD_VC: () => service.send(MyVcsTabEvents.ADD_VC()),

    GET_VC: () => service.send(MyVcsTabEvents.GET_VC()),

    REFRESH: () => vcService.send(VcEvents.REFRESH_MY_VCS()),

    VIEW_VC: (vcRef: ActorRefFrom<typeof vcItemMachine>) => {
      return service.send(MyVcsTabEvents.VIEW_VC(vcRef));
    },

    ONBOARDING_DONE: () => service.send(MyVcsTabEvents.ONBOARDING_DONE()),
  };
}
