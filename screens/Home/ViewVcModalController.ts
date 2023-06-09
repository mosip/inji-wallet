import { useMachine, useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import { ActorRefFrom } from 'xstate';
import { useTranslation } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';
import { ModalProps } from '../../components/ui/Modal';
import { GlobalContext } from '../../shared/GlobalContext';
import {
  selectOtpError,
  selectIsAcceptingOtpInput,
  selectIsAcceptingRevokeInput,
  selectIsEditingTag,
  selectIsLockingVc,
  selectIsRevokingVc,
  selectIsLoggingRevoke,
  selectVc,
  VcItemEvents,
  vcItemMachine,
  selectWalletBindingError,
  selectIsRequestBindingOtp,
  selectAcceptingBindingOtp,
  selectEmptyWalletBindingId,
  isWalletBindingInProgress,
  selectShowWalletBindingError,
  isShowingBindingWarning,
} from '../../machines/vcItem';
import { selectPasscode } from '../../machines/auth';
import { biometricsMachine, selectIsSuccess } from '../../machines/biometrics';

export function useViewVcModal({
  vcItemActor,
  isVisible,
  onRevokeDelete,
}: ViewVcModalProps) {
  const { t } = useTranslation('ViewVcModal');
  const [toastVisible, setToastVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [reAuthenticating, setReAuthenticating] = useState('');
  const [isRevoking, setRevoking] = useState(false);
  const [error, setError] = useState('');
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const [, bioSend, bioService] = useMachine(biometricsMachine);

  const isSuccessBio = useSelector(bioService, selectIsSuccess);
  const isLockingVc = useSelector(vcItemActor, selectIsLockingVc);
  const isRevokingVc = useSelector(vcItemActor, selectIsRevokingVc);
  const isLoggingRevoke = useSelector(vcItemActor, selectIsLoggingRevoke);
  const vc = useSelector(vcItemActor, selectVc);
  const otError = useSelector(vcItemActor, selectOtpError);
  const onSuccess = () => {
    bioSend({ type: 'SET_IS_AVAILABLE', data: true });
    setError('');
    setReAuthenticating('');
    vcItemActor.send(VcItemEvents.LOCK_VC());
  };

  const onError = (value: string) => {
    setError(value);
  };

  const showToast = (message: string) => {
    setToastVisible(true);
    setMessage(message);
    setTimeout(() => {
      setToastVisible(false);
      setMessage('');
    }, 3000);
  };

  const netInfoFetch = (otp: string) => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        vcItemActor.send(VcItemEvents.INPUT_OTP(otp));
      } else {
        vcItemActor.send(VcItemEvents.DISMISS());
        showToast('Request network failed');
      }
    });
  };

  useEffect(() => {
    if (isLockingVc) {
      showToast(vc.locked ? t('success.locked') : t('success.unlocked'));
    }
    if (isRevokingVc) {
      showToast(t('success.revoked', { vid: vc.id }));
    }
    if (isLoggingRevoke) {
      vcItemActor.send(VcItemEvents.DISMISS());
      onRevokeDelete();
    }
    if (isSuccessBio && reAuthenticating != '') {
      onSuccess();
    }
  }, [
    reAuthenticating,
    isLockingVc,
    isSuccessBio,
    otError,
    isRevokingVc,
    isLoggingRevoke,
    vc,
  ]);

  useEffect(() => {
    vcItemActor.send(VcItemEvents.REFRESH());
  }, [isVisible]);
  return {
    error,
    message,
    toastVisible,
    vc,
    otpError: useSelector(vcItemActor, selectOtpError),
    reAuthenticating,
    isRevoking,

    isEditingTag: useSelector(vcItemActor, selectIsEditingTag),
    isLockingVc,
    isAcceptingOtpInput: useSelector(vcItemActor, selectIsAcceptingOtpInput),
    isAcceptingRevokeInput: useSelector(
      vcItemActor,
      selectIsAcceptingRevokeInput
    ),
    storedPasscode: useSelector(authService, selectPasscode),
    isBindingOtp: useSelector(vcItemActor, selectIsRequestBindingOtp),
    isAcceptingBindingOtp: useSelector(vcItemActor, selectAcceptingBindingOtp),
    walletBindingError: useSelector(vcItemActor, selectWalletBindingError),
    isWalletBindingPending: useSelector(
      vcItemActor,
      selectEmptyWalletBindingId
    ),
    isWalletBindingInProgress: useSelector(
      vcItemActor,
      isWalletBindingInProgress
    ),
    isBindingError: useSelector(vcItemActor, selectShowWalletBindingError),
    isBindingWarning: useSelector(vcItemActor, isShowingBindingWarning),

    CONFIRM_REVOKE_VC: () => {
      setRevoking(true);
    },
    REVOKE_VC: () => {
      vcItemActor.send(VcItemEvents.REVOKE_VC());
      setRevoking(false);
    },
    setReAuthenticating,
    setRevoking,
    onError,
    addtoWallet: () => {
      vcItemActor.send(VcItemEvents.ADD_WALLET_BINDING_ID());
    },
    lockVc: () => {
      vcItemActor.send(VcItemEvents.LOCK_VC());
    },
    inputOtp: (otp: string) => {
      netInfoFetch(otp);
    },
    revokeVc: (otp: string) => {
      netInfoFetch(otp);
    },
    ADD_WALLET: () => vcItemActor.send(VcItemEvents.ADD_WALLET_BINDING_ID()),
    onSuccess,
    EDIT_TAG: () => vcItemActor.send(VcItemEvents.EDIT_TAG()),
    SAVE_TAG: (tag: string) => vcItemActor.send(VcItemEvents.SAVE_TAG(tag)),
    DISMISS: () => vcItemActor.send(VcItemEvents.DISMISS()),
    LOCK_VC: () => vcItemActor.send(VcItemEvents.LOCK_VC()),
    INPUT_OTP: (otp: string) => vcItemActor.send(VcItemEvents.INPUT_OTP(otp)),
    CANCEL: () => vcItemActor.send(VcItemEvents.CANCEL()),
    CONFIRM: () => vcItemActor.send(VcItemEvents.CONFIRM()),
  };
}

export interface ViewVcModalProps extends ModalProps {
  vcItemActor: ActorRefFrom<typeof vcItemMachine>;
  onDismiss: () => void;
  onRevokeDelete: () => void;
  activeTab: Number;
}
