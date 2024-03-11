import {useMachine, useSelector} from '@xstate/react';
import {useContext, useEffect, useState} from 'react';
import {ActorRefFrom} from 'xstate';
import {useTranslation} from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';
import {ModalProps} from '../../components/ui/Modal';
import {GlobalContext} from '../../shared/GlobalContext';
import {
  selectOtpError,
  selectWalletBindingError,
  selectEmptyWalletBindingId,
  selectShowWalletBindingError,
  selectWalletBindingSuccess,
  selectBindingAuthFailedError,
  selectAcceptingBindingOtp,
  selectWalletBindingInProgress,
  selectBindingWarning,
  selectIsPhoneNumber,
  selectIsEmail,
} from '../../machines/VCItemMachine/commonSelectors';
import {
  selectIsAcceptingOtpInput,
  selectIsAcceptingRevokeInput,
  selectIsLockingVc,
  selectIsRevokingVc,
  selectIsLoggingRevoke,
  selectVc,
  ExistingMosipVCItemEvents,
  ExistingMosipVCItemMachine,
  selectRequestBindingOtp,
} from '../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {selectPasscode} from '../../machines/auth';
import {biometricsMachine, selectIsSuccess} from '../../machines/biometrics';

export function useViewVcModal({
  vcItemActor,
  isVisible,
  onRevokeDelete,
}: ViewVcModalProps) {
  const {t} = useTranslation('ViewVcModal');
  const [toastVisible, setToastVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [reAuthenticating, setReAuthenticating] = useState('');
  const [isRevoking, setRevoking] = useState(false);
  const [error, setError] = useState('');
  const {appService} = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const [, bioSend, bioService] = useMachine(biometricsMachine);

  const isSuccessBio = useSelector(bioService, selectIsSuccess);
  const isLockingVc = useSelector(vcItemActor, selectIsLockingVc);
  const isRevokingVc = useSelector(vcItemActor, selectIsRevokingVc);
  const isLoggingRevoke = useSelector(vcItemActor, selectIsLoggingRevoke);
  const vc = useSelector(vcItemActor, selectVc);
  const otError = useSelector(vcItemActor, selectOtpError);
  const onSuccess = () => {
    bioSend({type: 'SET_IS_AVAILABLE', data: true});
    setError('');
    setReAuthenticating('');
    vcItemActor.send(ExistingMosipVCItemEvents.LOCK_VC());
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
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        vcItemActor.send(ExistingMosipVCItemEvents.INPUT_OTP(otp));
      } else {
        vcItemActor.send(ExistingMosipVCItemEvents.DISMISS());
        showToast('Request network failed');
      }
    });
  };

  useEffect(() => {
    if (isLockingVc) {
      showToast(vc.locked ? t('success.locked') : t('success.unlocked'));
    }
    if (isRevokingVc) {
      showToast(t('success.revoked', {vid: vc.id}));
    }
    if (isLoggingRevoke) {
      vcItemActor.send(ExistingMosipVCItemEvents.DISMISS());
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
    vcItemActor.send(ExistingMosipVCItemEvents.REFRESH());
  }, [isVisible]);
  return {
    error,
    message,
    toastVisible,
    vc,
    otpError: useSelector(vcItemActor, selectOtpError),
    bindingAuthFailedError: useSelector(
      vcItemActor,
      selectBindingAuthFailedError,
    ),
    reAuthenticating,
    isRevoking,

    isLockingVc,
    isAcceptingOtpInput: useSelector(vcItemActor, selectIsAcceptingOtpInput),
    isAcceptingRevokeInput: useSelector(
      vcItemActor,
      selectIsAcceptingRevokeInput,
    ),
    storedPasscode: useSelector(authService, selectPasscode),
    isBindingOtp: useSelector(vcItemActor, selectRequestBindingOtp),
    isAcceptingBindingOtp: useSelector(vcItemActor, selectAcceptingBindingOtp),
    walletBindingError: useSelector(vcItemActor, selectWalletBindingError),
    isWalletBindingPending: useSelector(
      vcItemActor,
      selectEmptyWalletBindingId,
    ),
    isWalletBindingInProgress: useSelector(
      vcItemActor,
      selectWalletBindingInProgress,
    ),
    isBindingError: useSelector(vcItemActor, selectShowWalletBindingError),
    isBindingSuccess: useSelector(vcItemActor, selectWalletBindingSuccess),
    isBindingWarning: useSelector(vcItemActor, selectBindingWarning),
    isPhoneNumber: useSelector(vcItemActor, selectIsPhoneNumber),
    isEmail: useSelector(vcItemActor, selectIsEmail),

    CONFIRM_REVOKE_VC: () => {
      setRevoking(true);
    },
    REVOKE_VC: () => {
      vcItemActor.send(ExistingMosipVCItemEvents.REVOKE_VC());
      setRevoking(false);
    },
    setReAuthenticating,
    setRevoking,
    onError,
    addtoWallet: () => {
      vcItemActor.send(ExistingMosipVCItemEvents.ADD_WALLET_BINDING_ID());
    },
    lockVc: () => {
      vcItemActor.send(ExistingMosipVCItemEvents.LOCK_VC());
    },
    inputOtp: (otp: string) => {
      netInfoFetch(otp);
    },
    revokeVc: (otp: string) => {
      netInfoFetch(otp);
    },
    ADD_WALLET: () =>
      vcItemActor.send(ExistingMosipVCItemEvents.ADD_WALLET_BINDING_ID()),
    onSuccess,
    DISMISS: () => vcItemActor.send(ExistingMosipVCItemEvents.DISMISS()),
    LOCK_VC: () => vcItemActor.send(ExistingMosipVCItemEvents.LOCK_VC()),
    INPUT_OTP: (otp: string) =>
      vcItemActor.send(ExistingMosipVCItemEvents.INPUT_OTP(otp)),
    RESEND_OTP: () => vcItemActor.send(ExistingMosipVCItemEvents.RESEND_OTP()),
    CANCEL: () => vcItemActor.send(ExistingMosipVCItemEvents.CANCEL()),
    CONFIRM: () => vcItemActor.send(ExistingMosipVCItemEvents.CONFIRM()),
  };
}

export interface ViewVcModalProps extends ModalProps {
  vcItemActor: ActorRefFrom<typeof ExistingMosipVCItemMachine>;
  onDismiss: () => void;
  onRevokeDelete: () => void;
  activeTab: Number;
}
