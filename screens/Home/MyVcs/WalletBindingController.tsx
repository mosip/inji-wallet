import { useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { GlobalContext } from '../../../shared/GlobalContext';
import { selectMyVcs, VcEvents } from '../../../machines/vc';
import { vcItemMachine } from '../../../machines/vcItem';
import { useTranslation } from 'react-i18next';

import { ActorRefFrom } from 'xstate';
import {
  selectIsAcceptingOtpInput,
  walletBindingInProgress,
  selectOtpError,
  WalletBindingEvents,
  selectShowWalletBindingError,
  selectWalletBindingError,
} from '../../../machines/walletBinding';

export function useWalletBinding() {
  const { t } = useTranslation('ProfileScreen');
  const { appService } = useContext(GlobalContext);
  const vcService = appService.children.get('vc');
  const walletBindingService = appService.children.get('walletBinding');
  const vcKeys = useSelector(vcService, selectMyVcs);
  // const isBindingWarning = useSelector(
  //   walletBindingService,
  //   selectIsBindingWarning
  // );
  const isAcceptingOtpInput = useSelector(
    walletBindingService,
    selectIsAcceptingOtpInput
  );

  const isWalletBindingInProgress = useSelector(
    walletBindingService,
    walletBindingInProgress
  );
  const isWalletBindingError = useSelector(
    walletBindingService,
    selectShowWalletBindingError
  );

  const walletBindingError = useSelector(
    walletBindingService,
    selectWalletBindingError
  );

  const otpError = useSelector(walletBindingService, selectOtpError);
  const [isRevoking, setRevoking] = useState(false);
  const [isAuthenticating, setAuthenticating] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const [selectedVidKeys, setSelectedVidKeys] = useState<string[]>([]);
  const [isBindingWarning, setBindingWarning] = useState(false);
  const [isAcceptingBindingOtp, setAcceptingBindingOtp] = useState(false);
  const selectVcItem = (index: number, vcKey: string) => {
    return () => {
      setSelectedIndex(index);
    };
  };

  return {
    isBindingWarning,
    otpError,
    isAcceptingOtpInput,
    isWalletBindingInProgress,
    isWalletBindingError,
    walletBindingError,

    DISMISS: () => {
      walletBindingService.send(WalletBindingEvents.DISMISS());
    },
    INPUT_OTP: (otp: string) =>
      walletBindingService.send(WalletBindingEvents.INPUT_OTP(otp)),
    REFRESH: () => vcService.send(VcEvents.REFRESH_MY_VCS()),

    CONFIRM: () => {
      walletBindingService.send(WalletBindingEvents.CONFIRM());
    },
    CANCEL: () => {
      walletBindingService.send(WalletBindingEvents.CANCEL());
    },
    setBindingWarning,
    setAuthenticating,
    selectVcItem,
    setIsViewing,
    setRevoking,
  };
}

export interface RevokeProps {
  service: ActorRefFrom<typeof vcItemMachine>;
}
