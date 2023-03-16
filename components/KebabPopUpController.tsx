import { useSelector } from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import {
  selectKebabPopUpWalletBindingInProgress,
  selectKebabPopUp,
  selectKebabPopUpAcceptingBindingOtp,
  selectKebabPopUpBindingWarning,
  selectEmptyWalletBindingId,
  selectIsPinned,
  selectOtpError,
  selectShowWalletBindingError,
  selectWalletBindingError,
  VcItemEvents,
  vcItemMachine,
} from '../machines/vcItem';

export function useKebabPopUp(props) {
  const service = props.service as ActorRefFrom<typeof vcItemMachine>;
  const PIN_CARD = () => service.send(VcItemEvents.PIN_CARD());
  const KEBAB_POPUP = () => service.send(VcItemEvents.KEBAB_POPUP());
  const ADD_WALLET_BINDING_ID = () =>
    service.send(VcItemEvents.ADD_WALLET_BINDING_ID());
  const CONFIRM = () => service.send(VcItemEvents.CONFIRM());
  const DISMISS = () => service.send(VcItemEvents.DISMISS());
  const CANCEL = () => service.send(VcItemEvents.CANCEL());
  const INPUT_OTP = (otp: string) => service.send(VcItemEvents.INPUT_OTP(otp));
  const isPinned = useSelector(service, selectIsPinned);
  const isBindingWarning = useSelector(service, selectKebabPopUpBindingWarning);
  const isAcceptingOtpInput = useSelector(
    service,
    selectKebabPopUpAcceptingBindingOtp
  );
  const isWalletBindingError = useSelector(
    service,
    selectShowWalletBindingError
  );
  const otpError = useSelector(service, selectOtpError);
  const walletBindingError = useSelector(service, selectWalletBindingError);
  const WalletBindingInProgress = useSelector(
    service,
    selectKebabPopUpWalletBindingInProgress
  );
  const emptyWalletBindingId = useSelector(service, selectEmptyWalletBindingId);
  const isKebabPopUp = useSelector(service, selectKebabPopUp);
  return {
    isPinned,
    PIN_CARD,
    KEBAB_POPUP,
    ADD_WALLET_BINDING_ID,
    CONFIRM,
    DISMISS,
    CANCEL,
    INPUT_OTP,
    isBindingWarning,
    isAcceptingOtpInput,
    isWalletBindingError,
    walletBindingError,
    otpError,
    WalletBindingInProgress,
    emptyWalletBindingId,
    isKebabPopUp,
  };
}
