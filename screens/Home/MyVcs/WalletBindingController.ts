import {useSelector, useInterpret} from '@xstate/react';
import {useContext, useRef, useState} from 'react';
import {GlobalContext} from '../../../shared/GlobalContext';
import {selectMyVcsMetadata, VcEvents} from '../../../machines/vc';
import {
  createVcItemMachine,
  isShowingBindingWarning,
  selectAcceptingBindingOtp,
  isWalletBindingInProgress,
  VcItemEvents,
  selectIsAcceptingOtpInput,
  selectOtpError,
  selectShowWalletBindingError,
  selectWalletBindingError,
} from '../../../machines/vcItem';
import {useTranslation} from 'react-i18next';

import {ActorRefFrom} from 'xstate';

export function useWalletBinding(props) {
  const {t} = useTranslation('ProfileScreen');
  const {appService} = useContext(GlobalContext);

  const machine = useRef(
    createVcItemMachine(
      appService.getSnapshot().context.serviceRefs,
      props.vcMetadata,
    ),
  );

  const bindingService = useInterpret(machine.current, {devTools: __DEV__});

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
    isWalletBindingInProgress,
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
      selectAcceptingBindingOtp,
    ),
    isBindingError: useSelector(bindingService, selectShowWalletBindingError),
    walletBindingError: useSelector(bindingService, selectWalletBindingError),

    DISMISS: () => bindingService.send(VcItemEvents.DISMISS()),

    CONFIRM: () => bindingService.send(VcItemEvents.CONFIRM()),

    CANCEL: () => bindingService.send(VcItemEvents.CANCEL()),

    REFRESH: () => vcService.send(VcEvents.REFRESH_MY_VCS()),
    setAuthenticating,
    selectVcItem,
    setIsViewing,
    setRevoking,
  };
}
