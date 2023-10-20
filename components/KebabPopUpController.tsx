import {useSelector} from '@xstate/react';
import {ActorRefFrom} from 'xstate';
import {
  ExistingMosipVCItemEvents,
  ExistingMosipVCItemMachine,
  selectBindingAuthFailedError,
  selectEmptyWalletBindingId,
  selectIsPinned,
  selectKebabPopUp,
  selectKebabPopUpAcceptingBindingOtp,
  selectKebabPopUpBindingWarning,
  selectKebabPopUpWalletBindingInProgress,
  selectOtpError,
  selectRemoveWalletWarning,
  selectShowActivities,
  selectShowWalletBindingError,
  selectWalletBindingError,
} from '../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';

import {
  EsignetMosipVCItemEvents,
  EsignetMosipVCItemMachine,
  selectEmptyWalletBindingId as esignetSelectEmptyWalletBindingId,
  selectIsPinned as esignetSelectIsPinned,
  selectKebabPopUp as esignetSelectKebabPopUp,
  selectKebabPopUpAcceptingBindingOtp as esignetSelectKebabPopUpAcceptingBindingOtp,
  selectKebabPopUpBindingWarning as esignetSelectKebabPopUpBindingWarning,
  selectKebabPopUpWalletBindingInProgress as esignetSelectKebabPopUpWalletBindingInProgress,
  selectOtpError as esignetSelectOtpError,
  selectRemoveWalletWarning as esignetSelectRemoveWalletWarning,
  selectShowActivities as esignetSelectShowActivities,
  selectShowWalletBindingError as esignetSelectShowWalletBindingError,
  selectWalletBindingError as esignetSelectWalletBindingError,
} from '../machines/VCItemMachine/EsignetMosipVCItem/EsignetMosipVCItemMachine';
import {selectActivities} from '../machines/activityLog';
import {GlobalContext} from '../shared/GlobalContext';
import {useContext} from 'react';
import {VCMetadata} from '../shared/VCMetadata';

export function useKebabPopUp(props) {
  const service = props.service as
    | ActorRefFrom<typeof ExistingMosipVCItemMachine>
    | ActorRefFrom<typeof EsignetMosipVCItemMachine>;
  const vcEvents =
    props.vcKey !== undefined && props.vcMetadata.isFromOpenId4VCI()
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
  let isPinned = useSelector(service, selectIsPinned);
  let isBindingWarning = useSelector(service, selectKebabPopUpBindingWarning);
  let isRemoveWalletWarning = useSelector(service, selectRemoveWalletWarning);
  let isAcceptingOtpInput = useSelector(
    service,
    selectKebabPopUpAcceptingBindingOtp,
  );
  let isWalletBindingError = useSelector(service, selectShowWalletBindingError);
  let otpError = useSelector(service, selectOtpError);
  let walletBindingError = useSelector(service, selectWalletBindingError);
  let bindingAuthFailedError = useSelector(
    service,
    selectBindingAuthFailedError,
  );
  let WalletBindingInProgress = useSelector(
    service,
    selectKebabPopUpWalletBindingInProgress,
  );
  let emptyWalletBindingId = useSelector(service, selectEmptyWalletBindingId);
  let isKebabPopUp = useSelector(service, selectKebabPopUp);
  let isShowActivities = useSelector(service, selectShowActivities);

  if (props.vcMetadata.isFromOpenId4VCI()) {
    isPinned = useSelector(service, esignetSelectIsPinned);
    isBindingWarning = useSelector(
      service,
      esignetSelectKebabPopUpBindingWarning,
    );
    isRemoveWalletWarning = useSelector(
      service,
      esignetSelectRemoveWalletWarning,
    );
    isAcceptingOtpInput = useSelector(
      service,
      esignetSelectKebabPopUpAcceptingBindingOtp,
    );
    isWalletBindingError = useSelector(
      service,
      esignetSelectShowWalletBindingError,
    );
    otpError = useSelector(service, esignetSelectOtpError);
    walletBindingError = useSelector(service, esignetSelectWalletBindingError);
    bindingAuthFailedError = useSelector(service, selectBindingAuthFailedError);
    WalletBindingInProgress = useSelector(
      service,
      esignetSelectKebabPopUpWalletBindingInProgress,
    );
    emptyWalletBindingId = useSelector(
      service,
      esignetSelectEmptyWalletBindingId,
    );
    isKebabPopUp = useSelector(service, esignetSelectKebabPopUp);
    isShowActivities = useSelector(service, esignetSelectShowActivities);
  }
  const {appService} = useContext(GlobalContext);
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
    bindingAuthFailedError,
    otpError,
    WalletBindingInProgress,
    emptyWalletBindingId,
    isKebabPopUp,
    isShowActivities,
    isRemoveWalletWarning,
    activities: useSelector(activityLogService, selectActivities),
  };
}
