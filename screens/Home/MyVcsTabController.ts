import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {ActorRefFrom} from 'xstate';
import {selectIsTampered} from '../../machines/store';
import {
  selectIsRefreshingMyVcs,
  selectMyVcs,
  VcEvents,
} from '../../machines/vc';
import {
  selectWalletBindingError,
  selectShowWalletBindingError,
} from '../../machines/vcItem';
import {vcItemMachine} from '../../machines/vcItem';
import {GlobalContext} from '../../shared/GlobalContext';
import {HomeScreenTabProps} from './HomeScreen';
import {
  MyVcsTabEvents,
  MyVcsTabMachine,
  selectAddVcModal,
  selectIsRequestSuccessful,
  selectGetVcModal,
  selectIsSavingFailedInIdle,
  selectIsMinimumStorageLimitReached,
} from './MyVcsTabMachine';
import {
  selectShowHardwareKeystoreNotExistsAlert,
  SettingsEvents,
} from '../../machines/settings';

export function useMyVcsTab(props: HomeScreenTabProps) {
  const service = props.service as ActorRefFrom<typeof MyVcsTabMachine>;
  const {appService} = useContext(GlobalContext);
  const vcService = appService.children.get('vc');
  const storeService = appService.children.get('store');
  const settingsService = appService.children.get('settings');

  return {
    service,
    AddVcModalService: useSelector(service, selectAddVcModal),
    GetVcModalService: useSelector(service, selectGetVcModal),

    vcKeys: useSelector(vcService, selectMyVcs),
    isTampered: useSelector(storeService, selectIsTampered),

    isRefreshingVcs: useSelector(vcService, selectIsRefreshingMyVcs),
    isRequestSuccessful: useSelector(service, selectIsRequestSuccessful),
    isSavingFailedInIdle: useSelector(service, selectIsSavingFailedInIdle),
    walletBindingError: useSelector(service, selectWalletBindingError),
    isBindingError: useSelector(service, selectShowWalletBindingError),
    isMinimumStorageLimitReached: useSelector(
      service,
      selectIsMinimumStorageLimitReached,
    ),
    showHardwareKeystoreNotExistsAlert: useSelector(
      settingsService,
      selectShowHardwareKeystoreNotExistsAlert,
    ),
    DISMISS: () => service.send(MyVcsTabEvents.DISMISS()),

    DOWNLOAD_ID: () => service.send(MyVcsTabEvents.ADD_VC()),

    GET_VC: () => service.send(MyVcsTabEvents.GET_VC()),

    REFRESH: () => vcService.send(VcEvents.REFRESH_MY_VCS()),

    VIEW_VC: (vcRef: ActorRefFrom<typeof vcItemMachine>) => {
      return service.send(MyVcsTabEvents.VIEW_VC(vcRef));
    },

    IS_TAMPERED: () => service.send(MyVcsTabEvents.IS_TAMPERED()),

    ACCEPT_HARDWARE_SUPPORT_NOT_EXISTS: () =>
      settingsService.send(SettingsEvents.ACCEPT_HARDWARE_SUPPORT_NOT_EXISTS()),
  };
}
