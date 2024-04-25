import {useContext} from 'react';
import {GlobalContext} from '../shared/GlobalContext';
import {useSelector} from '@xstate/react';
import {
  selectWalletBindingSuccess,
  selectVerificationStatus,
} from '../machines/VerifiableCredential/VCMetaMachine/VCMetaSelectors';
import {VcMetaEvents} from '../machines/VerifiableCredential/VCMetaMachine/VCMetaMachine';

export const UseBannerNotificationContainer = () => {
  const {appService} = useContext(GlobalContext);
  const vcMetaService = appService.children.get('vcMeta')!!;
  const isBindingSuccess = useSelector(
    vcMetaService,
    selectWalletBindingSuccess,
  );
  const DISMISS = () => {
    vcMetaService?.send(VcMetaEvents.RESET_WALLET_BINDING_SUCCESS());
  };
  return {
    isBindingSuccess,
    verificationStatus: useSelector(vcMetaService, selectVerificationStatus),
    DISMISS,
    RESET_VERIFICATION_STATUS: () =>
      vcMetaService?.send(VcMetaEvents.RESET_VERIFICATION_STATUS(null)),
  };
};
