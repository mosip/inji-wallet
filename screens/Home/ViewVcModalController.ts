import { useSelector } from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import { ModalProps } from '../../components/ui/Modal';
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

export function useViewVcModal({ vcItemActor }: ViewVcModalProps) {
  return {
    vc: useSelector(vcItemActor, selectVc),
    otpError: useSelector(vcItemActor, selectOtpError),

    isEditingTag: useSelector(vcItemActor, selectIsEditingTag),
    selectIsLockingVc: useSelector(vcItemActor, selectIsLockingVc),
    isAcceptingOtpInput: useSelector(vcItemActor, selectIsAcceptingOtpInput),
    isRequestingOtp: useSelector(vcItemActor, selectIsRequestingOtp),

    EDIT_TAG: () => vcItemActor.send(VcItemEvents.EDIT_TAG()),
    SAVE_TAG: (tag: string) => vcItemActor.send(VcItemEvents.SAVE_TAG(tag)),
    DISMISS: () => vcItemActor.send(VcItemEvents.DISMISS()),
    LOCK: (value: boolean) => vcItemActor.send(VcItemEvents.LOCK(value)),
    LOCK_VC: () => vcItemActor.send(VcItemEvents.LOCK_VC()),
    UNLOCK_VC: () => vcItemActor.send(VcItemEvents.UNLOCK_VC()),
    INPUT_OTP: (otp: string) => vcItemActor.send(VcItemEvents.INPUT_OTP(otp)),
  };
}

export interface ViewVcModalProps extends ModalProps {
  vcItemActor: ActorRefFrom<typeof vcItemMachine>;
}
