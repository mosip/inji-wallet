import {useContext} from 'react';
import {GlobalContext} from '../shared/GlobalContext';
import {useSelector} from '@xstate/react';
import {selectWalletBindingSuccess} from '../machines/VerifiableCredential/VCMetaMachine/VCMetaSelectors';
import {VcMetaEvents} from '../machines/VerifiableCredential/VCMetaMachine/VCMetaMachine';

export const UseWalletBindingSuccess = () => {
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
    DISMISS,
  };
};
