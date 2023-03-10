import { useInterpret, useSelector } from '@xstate/react';
import { useContext, useRef, useState } from 'react';
import {
  createVcItemMachine,
  isShowBindingWarning,
  isWalletBindingInProgress,
  selectAcceptingBindingOtp,
  selectEmptyWalletBindingId,
  selectIsPinned,
  selectOtpError,
  selectShowWalletBindingError,
  selectWalletBindingError,
  VcItemEvents,
} from '../machines/vcItem';
import { GlobalContext } from '../shared/GlobalContext';

export function useKebabPopUp(props) {
  const { appService } = useContext(GlobalContext);
  const machine = useRef(
    createVcItemMachine(
      appService.getSnapshot().context.serviceRefs,
      props.vcKey
    )
  );
  const service = useInterpret(machine.current, { devTools: __DEV__ });
  const PIN_CARD = () => service.send(VcItemEvents.PIN_CARD());
  const ADD_WALLET_BINDING_ID = () =>
    service.send(VcItemEvents.ADD_WALLET_BINDING_ID());
  const CONFIRM = () => service.send(VcItemEvents.CONFIRM());
  const DISMISS = () => service.send(VcItemEvents.DISMISS());
  const CANCEL = () => service.send(VcItemEvents.CANCEL());
  const INPUT_OTP = (otp: string) => service.send(VcItemEvents.INPUT_OTP(otp));
  const isPinned = useSelector(service, selectIsPinned);
  const [visible, setVisible] = useState(false);
  const isBindingWarning = useSelector(service, isShowBindingWarning);
  const isAcceptingOtpInput = useSelector(service, selectAcceptingBindingOtp);
  const isWalletBindingError = useSelector(
    service,
    selectShowWalletBindingError
  );
  const otpError = useSelector(service, selectOtpError);
  const walletBindingError = useSelector(service, selectWalletBindingError);
  const WalletBindingInProgress = useSelector(
    service,
    isWalletBindingInProgress
  );
  const emptyWalletBindingId = useSelector(service, selectEmptyWalletBindingId);

  return {
    isPinned,
    visible,
    setVisible,
    PIN_CARD,
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
  };
}
