import {useContext} from 'react';
import {GlobalContext} from '../shared/GlobalContext';
import {useSelector} from '@xstate/react';
import {
  VcEvents,
  selectWalletBindingSuccess,
} from '../machines/VCItemMachine/vc';

export const UseWalletBindingSuccess = () => {
  const {appService} = useContext(GlobalContext);
  const vcService = appService.children.get('vc');
  const isBindingSuccess = useSelector(vcService, selectWalletBindingSuccess);
  const DISMISS = () => {
    vcService?.send(VcEvents.RESET_WALLET_BINDING_SUCCESS());
  };
  return {
    isBindingSuccess,
    DISMISS,
  };
};
