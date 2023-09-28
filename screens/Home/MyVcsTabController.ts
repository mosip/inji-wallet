import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {ActorRefFrom} from 'xstate';
import {
  selectIsRefreshingMyVcs,
  selectMyVcsMetadata,
  selectWalletBindingSuccess,
  VcEvents,
  selectAreAllVcsDownloaded,
  selectInProgressVcDownloadsCount,
} from '../../machines/vc';
import {
  selectWalletBindingError,
  selectShowWalletBindingError,
} from '../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {ExistingMosipVCItemMachine} from '../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
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
import {EsignetMosipVCItemMachine} from '../../machines/VCItemMachine/EsignetMosipVCItem/EsignetMosipVCItemMachine';

export function useMyVcsTab(props: HomeScreenTabProps) {
  const service = props.service as ActorRefFrom<typeof MyVcsTabMachine>;
  const {appService} = useContext(GlobalContext);
  const vcService = appService.children.get('vc');
  const settingsService = appService.children.get('settings');

  return {
    service,
    AddVcModalService: useSelector(service, selectAddVcModal),
    GetVcModalService: useSelector(service, selectGetVcModal),

    vcMetadatas: useSelector(vcService, selectMyVcsMetadata),

    isRefreshingVcs: useSelector(vcService, selectIsRefreshingMyVcs),
    isRequestSuccessful: useSelector(service, selectIsRequestSuccessful),
    isSavingFailedInIdle: useSelector(service, selectIsSavingFailedInIdle),
    walletBindingError: useSelector(service, selectWalletBindingError),
    isBindingError: useSelector(service, selectShowWalletBindingError),
    isBindingSuccess: useSelector(vcService, selectWalletBindingSuccess),
    isMinimumStorageLimitReached: useSelector(
      service,
      selectIsMinimumStorageLimitReached,
    ),
    showHardwareKeystoreNotExistsAlert: useSelector(
      settingsService,
      selectShowHardwareKeystoreNotExistsAlert,
    ),
    areAllVcsLoaded: useSelector(vcService, selectAreAllVcsDownloaded),
    inProgressVcDownloadsCount: useSelector(
      vcService,
      selectInProgressVcDownloadsCount,
    ),

    SET_STORE_VC_ITEM_STATUS: () =>
      service.send(MyVcsTabEvents.SET_STORE_VC_ITEM_STATUS()),

    RESET_STORE_VC_ITEM_STATUS: () =>
      service.send(MyVcsTabEvents.RESET_STORE_VC_ITEM_STATUS()),

    RESET_ARE_ALL_VCS_DOWNLOADED: () =>
      vcService.send(VcEvents.RESET_ARE_ALL_VCS_DOWNLOADED()),

    DISMISS: () => service.send(MyVcsTabEvents.DISMISS()),

    DOWNLOAD_ID: () => service.send(MyVcsTabEvents.ADD_VC()),

    GET_VC: () => service.send(MyVcsTabEvents.GET_VC()),

    REFRESH: () => vcService.send(VcEvents.REFRESH_MY_VCS()),

    VIEW_VC: (
      vcRef:
        | ActorRefFrom<typeof ExistingMosipVCItemMachine>
        | ActorRefFrom<typeof EsignetMosipVCItemMachine>,
    ) => {
      return service.send(MyVcsTabEvents.VIEW_VC(vcRef));
    },

    DISMISS_WALLET_BINDING_NOTIFICATION_BANNER: () =>
      vcService?.send(VcEvents.RESET_WALLET_BINDING_SUCCESS()),

    ACCEPT_HARDWARE_SUPPORT_NOT_EXISTS: () =>
      settingsService.send(SettingsEvents.ACCEPT_HARDWARE_SUPPORT_NOT_EXISTS()),
  };
}
