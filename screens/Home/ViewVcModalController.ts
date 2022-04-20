import { useMachine, useSelector } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import { ActorRefFrom } from 'xstate';
import { ModalProps } from '../../components/ui/Modal';
import { GlobalContext } from '../../shared/GlobalContext';
import { selectIsOnline } from '../../machines/app';
import {
  selectOtpError,
  selectIsAcceptingOtpInput,
  selectIsEditingTag,
  selectIsLockingVc,
  selectIsRequestingOtp,
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

export function useViewVcModal({ vcItemActor }: ViewVcModalProps) {
  const [toastVisible, setToastVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [reAuthenticating, setReAuthenticating] = useState('');
  const [error, setError] = useState('');
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const [, bioSend, bioService] = useMachine(biometricsMachine);
  const isOnline = useSelector(appService, selectIsOnline);
  const isAvailable = useSelector(bioService, selectIsAvailable);
  const isSuccessBio = useSelector(bioService, selectIsSuccess);
  const isLockingVc = useSelector(vcItemActor, selectIsLockingVc);
  const vc = useSelector(vcItemActor, selectVc);

  const onSuccess = () => {
    if (vc.locked) {
      vcItemActor.send(VcItemEvents.UNLOCK_VC());
    } else {
      vcItemActor.send(VcItemEvents.LOCK_VC());
    }
  };

  const onError = (value: string) => {
    setError(value);
    setReAuthenticating('');
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
    if (isSuccessBio) {
      onSuccess();
    }
  }, [isLockingVc, isSuccessBio]);

  return {
    error,
    message,
    toastVisible,
    vc,
    otpError: useSelector(vcItemActor, selectOtpError),
    reAuthenticating,

    isEditingTag: useSelector(vcItemActor, selectIsEditingTag),
    isLockingVc,
    isAcceptingOtpInput: useSelector(vcItemActor, selectIsAcceptingOtpInput),
    isRequestingOtp: useSelector(vcItemActor, selectIsRequestingOtp),
    storedPasscode: useSelector(authService, selectPasscode),
    setReAuthenticating,
    onError,
    lockVc: () => {
      if (isOnline) {
        if (isAvailable) {
          setReAuthenticating('biometrics');
          bioSend({ type: 'AUTHENTICATE' });
        } else {
          setReAuthenticating('passcode');
        }
      } else {
        showToast('Request network failed');
      }
    },
    inputOtp: (otp: string) => {
      if (isOnline) {
        vcItemActor.send(VcItemEvents.INPUT_OTP(otp));
      } else {
        vcItemActor.send(VcItemEvents.DISMISS());
        showToast('Request network failed');
      }
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
