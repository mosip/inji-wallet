import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { ActorRefFrom } from 'xstate';
import {
  selectIsRefreshingMyVcs,
  selectMyVcs,
  VcEvents,
} from '../../../machines/vc';
import { GlobalContext } from '../../../shared/GlobalContext';
import NetInfo from '@react-native-community/netinfo';
import { selectVcLabel } from '../../../machines/settings';
import {
  selectAcceptingBindingOtp,
  selectIsRequestBindingOtp,
  selectOtpError,
  selectShowBindingStatus,
  selectWalletBindingError,
  selectWalletBindingId,
  VcItemEvents,
  vcItemMachine,
} from '../../../machines/vcItem';
import { ModalProps } from '../../../components/ui/Modal';

export function useBindVcStatus(props: BindVcProps) {
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');
  const vcService = appService.children.get('vc');

  const netInfoFetch = (otp: string) => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        vcService.send(VcItemEvents.INPUT_OTP(otp));
      } else {
        vcService.send(VcItemEvents.DISMISS());
        showToast('Request network failed');
      }
    });
  };

  return {
    vcKeys: useSelector(vcService, selectMyVcs),
    vcLabel: useSelector(settingsService, selectVcLabel),

    isRefreshingVcs: useSelector(vcService, selectIsRefreshingMyVcs),
    isBindingOtp: useSelector(vcService, selectIsRequestBindingOtp),
    walletAddress: useSelector(vcService, selectWalletBindingId),
    isAcceptingBindingOtp: useSelector(vcService, selectAcceptingBindingOtp),
    showBindingStatus: useSelector(vcService, selectShowBindingStatus),
    walletBindingError: useSelector(vcService, selectWalletBindingError),

    inputOtp: (otp: string) => {
      netInfoFetch(otp);
    },
    otpError: useSelector(vcService, selectOtpError),
    BINDING_DONE: () => vcService.send(VcItemEvents.BINDING_DONE()),
    INPUT_OTP: (otp: string) => vcService.send(VcItemEvents.INPUT_OTP(otp)),
    DISMISS: () => vcService.send(VcItemEvents.DISMISS()),

    REFRESH: () => vcService.send(VcEvents.REFRESH_MY_VCS()),
  };
}
function showToast(arg0: string) {
  throw new Error('Function not implemented.');
}

export interface BindVcProps extends ModalProps {
  bindingError: string;
  onDone: () => void;
}
