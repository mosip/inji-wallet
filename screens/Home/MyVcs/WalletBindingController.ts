import { useSelector, useInterpret } from '@xstate/react';
import { useContext, useRef, useState } from 'react';
import { GlobalContext } from '../../../shared/GlobalContext';
import { selectMyVcsMetadata, VcEvents } from '../../../machines/vc';
import {
  createExistingMosipVCItemMachine,
  isShowingBindingWarning,
  selectAcceptingBindingOtp,
  ExistingMosipVCItemEvents,
  selectIsAcceptingOtpInput,
  selectOtpError,
  selectShowWalletBindingError,
  selectWalletBindingError,
} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import { useTranslation } from 'react-i18next';

import { ActorRefFrom } from 'xstate';

export function useWalletBinding(props) {
  const { t } = useTranslation('ProfileScreen');
  const { appService } = useContext(GlobalContext);

  const machine = useRef(
    createExistingMosipVCItemMachine(
      appService.getSnapshot().context.serviceRefs,
      props.vcMetadata
    )
  );

  const bindingService = useInterpret(machine.current, { devTools: __DEV__ });

  const vcService = appService.children.get('vc');

  const vcsMetadata = useSelector(vcService, selectMyVcsMetadata);

  const otpError = useSelector(bindingService, selectOtpError);
  const [isRevoking, setRevoking] = useState(false);
  const [isAuthenticating, setAuthenticating] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isBindingWarning, setisBindingWarning] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const [selectedVidKeys, setSelectedVidKeys] = useState<string[]>([]);

  const selectVcItem = (index: number, vcKey: string) => {
    return () => {
      setSelectedIndex(index);
    };
  };

  const WalletBindingInProgress = useSelector(
    bindingService,
    isWalletBindingInProgress
  );

  return {
    isBindingWarning,
    setisBindingWarning,
    otpError,
    message,
    toastVisible,
    WalletBindingInProgress,

    isAcceptingOtpInput: useSelector(bindingService, selectIsAcceptingOtpInput),
    isAcceptingBindingOtp: useSelector(
      bindingService,
      selectAcceptingBindingOtp
    ),
    isBindingError: useSelector(bindingService, selectShowWalletBindingError),
    walletBindingError: useSelector(bindingService, selectWalletBindingError),
    RESEND_OTP: () =>
      bindingService.send(ExistingMosipVCItemEvents.RESEND_OTP()),

    DISMISS: () => bindingService.send(ExistingMosipVCItemEvents.DISMISS()),

    CONFIRM: () => bindingService.send(ExistingMosipVCItemEvents.CONFIRM()),

    CANCEL: () => bindingService.send(ExistingMosipVCItemEvents.CANCEL()),

    REFRESH: () => vcService.send(VcEvents.REFRESH_MY_VCS()),
    setAuthenticating,
    selectVcItem,
    setIsViewing,
    setRevoking,
  };
}
