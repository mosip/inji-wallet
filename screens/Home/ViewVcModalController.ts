import { useSelector } from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import { ModalProps } from '../../components/ui/Modal';
import {
  selectOtpError,
  selectIsEditingTag,
  selectIsLockingVc,
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

    EDIT_TAG: () => vcItemActor.send(VcItemEvents.EDIT_TAG()),
    SAVE_TAG: (tag: string) => vcItemActor.send(VcItemEvents.SAVE_TAG(tag)),
    DISMISS: () => vcItemActor.send(VcItemEvents.DISMISS()),
    LOCK: (value: boolean) => vcItemActor.send(VcItemEvents.LOCK(value)),
    LOCKING_VC: () => vcItemActor.send(VcItemEvents.LOCKING_VC()),
    INPUT_OTP: (otp: string) => vcItemActor.send(VcItemEvents.INPUT_OTP(otp)),
  };
}

export interface ViewVcModalProps extends ModalProps {
  vcItemActor: ActorRefFrom<typeof vcItemMachine>;
}
