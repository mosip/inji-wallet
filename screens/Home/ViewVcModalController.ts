import { useMachine, useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import { ActorRefFrom } from 'xstate';
import NetInfo from '@react-native-community/netinfo';
import { ModalProps } from '../../components/ui/Modal';
import { GlobalContext } from '../../shared/GlobalContext';
import {
  selectOtpError,
  selectIsAcceptingOtpInput,
  selectIsEditingTag,
  selectIsLockingVc,
  selectIsRequestingOtp,
  selectIsRevokingVc,
  selectVc,
  VcItemEvents,
  vcItemMachine,
} from '../../machines/vcItem';
import { selectPasscode } from '../../machines/auth';
import {
  biometricsMachine,
  selectIsAvailable,
  selectIsSuccess,
} from '../../machines/biometrics';
import { selectBiometricUnlockEnabled } from '../../machines/settings';

export function useViewVcModal({ vcItemActor, isVisible }: ViewVcModalProps) {
  const [toastVisible, setToastVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [reAuthenticating, setReAuthenticating] = useState('');
  const [isRevoking, setRevoking] = useState(false);
  const [error, setError] = useState('');
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const settingsService = appService.children.get('settings');
  const [, bioSend, bioService] = useMachine(biometricsMachine);
  const isBiometricUnlockEnabled = useSelector(
    settingsService,
    selectBiometricUnlockEnabled
  );
  const isAvailable = useSelector(bioService, selectIsAvailable);
  const isSuccessBio = useSelector(bioService, selectIsSuccess);
  const isLockingVc = useSelector(vcItemActor, selectIsLockingVc);
  const isRevokingVc = useSelector(vcItemActor, selectIsRevokingVc);
  const vc = useSelector(vcItemActor, selectVc);

  const otError = useSelector(vcItemActor, selectOtpError);
  const onSuccess = () => {
    bioSend({ type: 'SET_IS_AVAILABLE', data: true });
    setError('');
    setReAuthenticating('');
    if (vc.locked) {
      vcItemActor.send(VcItemEvents.UNLOCK_VC());
    } else {
      vcItemActor.send(VcItemEvents.LOCK_VC());
    }
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

  useEffect(() => {
    if (isLockingVc) {
      showToast(
        vc.locked ? 'ID successfully locked' : 'ID successfully unlocked'
      );
    }
    if (isRevokingVc) {
      showToast(
        vc.revoked
          ? `VID ${vc.id} has been revoked. Any credential containing the same will be removed automatically from the wallet`
          : 'De-revocation request submitted'
      );
    }
    if (isSuccessBio && reAuthenticating != '') {
      onSuccess();
    }
  }, [reAuthenticating, isLockingVc, isSuccessBio, otError]);

  useEffect(() => {
    vcItemActor.send(VcItemEvents.REFRESH());
  }, [isVisible]);
  const isRequestingOtp = useSelector(vcItemActor, selectIsRequestingOtp);
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
    isRequestingOtp: useSelector(vcItemActor, selectIsRequestingOtp),
    storedPasscode: useSelector(authService, selectPasscode),

    getData: (dropDownList: any, idType: string) => {
      return dropDownList.filter(
        (dropdown: any) =>
          dropdown['idType'] === undefined || dropdown['idType'] === idType
      );
    },
    CONFIRM_REVOKE_VC: () => {
      setRevoking(true);
    },
    REVOKE_VC: () => {
      console.log('otp', isRequestingOtp);
      vcItemActor.send(VcItemEvents.REVOKE_VC());
      setRevoking(false);
    },
    setReAuthenticating,
    onError,
    lockVc: () => {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          if (isAvailable && isBiometricUnlockEnabled) {
            setReAuthenticating('biometrics');
            bioSend({ type: 'AUTHENTICATE' });
          } else {
            setReAuthenticating('passcode');
          }
        } else {
          showToast('Request network failed');
        }
      });
    },
    inputOtp: (otp: string) => {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          vcItemActor.send(VcItemEvents.INPUT_OTP(otp));
        } else {
          vcItemActor.send(VcItemEvents.DISMISS());
          showToast('Request network failed');
        }
      });
    },
    onSuccess,
    EDIT_TAG: () => vcItemActor.send(VcItemEvents.EDIT_TAG()),
    SAVE_TAG: (tag: string) => vcItemActor.send(VcItemEvents.SAVE_TAG(tag)),
    DISMISS: () => vcItemActor.send(VcItemEvents.DISMISS()),
    LOCK_VC: () => vcItemActor.send(VcItemEvents.LOCK_VC()),
    UNLOCK_VC: () => vcItemActor.send(VcItemEvents.UNLOCK_VC()),
    INPUT_OTP: (otp: string) => vcItemActor.send(VcItemEvents.INPUT_OTP(otp)),
  };
}

export interface ViewVcModalProps extends ModalProps {
  vcItemActor: ActorRefFrom<typeof vcItemMachine>;
}
