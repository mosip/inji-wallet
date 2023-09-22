import { useSelector } from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import {
  selectKebabPopUpWalletBindingInProgress,
  selectKebabPopUp,
  selectKebabPopUpAcceptingBindingOtp,
  selectKebabPopUpBindingWarning,
  selectRemoveWalletWarning,
  selectEmptyWalletBindingId,
  selectIsPinned,
  selectOtpError,
  selectShowWalletBindingError,
  selectWalletBindingError,
  ExistingMosipVCItemEvents,
  ExistingMosipVCItemMachine,
  selectShowActivities,
} from '../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import { selectActivities } from '../machines/activityLog';
import { GlobalContext } from '../shared/GlobalContext';
import { useContext } from 'react';
import { VCMetadata } from '../shared/VCMetadata';
import {
  EsignetMosipVCItemEvents,
  EsignetMosipVCItemMachine,
} from '../machines/VCItemMachine/EsignetMosipVCItem/EsignetMosipVCItemMachine';
import { isVCFromOpenId4VCI } from '../shared/openId4VCI/Utils';

export function useKebabPopUp(props) {
  const service = props.service as
    | ActorRefFrom<typeof ExistingMosipVCItemMachine>
    | ActorRefFrom<typeof EsignetMosipVCItemMachine>;
  const vcEvents =
    props.vcKey !== undefined && isVCFromOpenId4VCI(props.vcMetadata)
      ? EsignetMosipVCItemEvents
      : ExistingMosipVCItemEvents;
  const PIN_CARD = () => service.send(vcEvents.PIN_CARD());
  const KEBAB_POPUP = () => service.send(vcEvents.KEBAB_POPUP());
  const ADD_WALLET_BINDING_ID = () =>
    service.send(vcEvents.ADD_WALLET_BINDING_ID());
  const CONFIRM = () => service.send(vcEvents.CONFIRM());
  const REMOVE = (vcMetadata: VCMetadata) =>
    service.send(vcEvents.REMOVE(vcMetadata));
  const DISMISS = () => service.send(vcEvents.DISMISS());
  const CANCEL = () => service.send(vcEvents.CANCEL());
  const SHOW_ACTIVITY = () => service.send(vcEvents.SHOW_ACTIVITY());
  const INPUT_OTP = (otp: string) => service.send(vcEvents.INPUT_OTP(otp));
  const RESEND_OTP = () => service.send(vcEvents.RESEND_OTP());
  const isPinned = useSelector(service, selectIsPinned);
  const isBindingWarning = useSelector(service, selectKebabPopUpBindingWarning);
  const isRemoveWalletWarning = useSelector(service, selectRemoveWalletWarning);
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
    REMOVE,
    CANCEL,
    INPUT_OTP,
    RESEND_OTP,
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
    isRemoveWalletWarning,
    activities: useSelector(activityLogService, selectActivities),
  };
}
