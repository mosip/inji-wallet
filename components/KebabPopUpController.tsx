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
  selectShowActivities,
} from '../machines/vcItem';
import { selectActivities } from '../machines/activityLog';
import { GlobalContext } from '../shared/GlobalContext';
import { useContext } from 'react';

export function useKebabPopUp(props) {
  const service = props.service as ActorRefFrom<typeof vcItemMachine>;
  const PIN_CARD = () => service.send(VcItemEvents.PIN_CARD());
  const KEBAB_POPUP = () => service.send(VcItemEvents.KEBAB_POPUP());
  const ADD_WALLET_BINDING_ID = () =>
    service.send(VcItemEvents.ADD_WALLET_BINDING_ID());
  const CONFIRM = () => service.send(VcItemEvents.CONFIRM());
  const DISMISS = () => service.send(VcItemEvents.DISMISS());
  const CANCEL = () => service.send(VcItemEvents.CANCEL());
  const SHOW_ACTIVITY = () => service.send(VcItemEvents.SHOW_ACTIVITY());
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
  const isShowActivities = useSelector(service, selectShowActivities);
  const { appService } = useContext(GlobalContext);
  const activityLogService = appService.children.get('activityLog');

  return {
    isPinned,
    PIN_CARD,
    KEBAB_POPUP,
    ADD_WALLET_BINDING_ID,
    CONFIRM,
    DISMISS,
    CANCEL,
    INPUT_OTP,
    SHOW_ACTIVITY,
    isBindingWarning,
    isAcceptingOtpInput,
    isWalletBindingError,
    walletBindingError,
    otpError,
    WalletBindingInProgress,
    emptyWalletBindingId,
    isKebabPopUp,
    isShowActivities,
    activities: useSelector(activityLogService, selectActivities),
  };
}
