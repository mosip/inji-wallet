import { useSelector } from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import {
  AddVcModalEvents,
  AddVcModalMachine,
  selectIsAcceptingOtpInput,
  selectIsRequestingCredential,
  selectOtpError,
  selectIsAcceptingIdInput,
} from './AddVcModalMachine';

export function useAddVcModal({ service }: AddVcModalProps) {
  return {
    isRequestingCredential: useSelector(service, selectIsRequestingCredential),

    otpError: useSelector(service, selectOtpError),

    isAcceptingUinInput: useSelector(service, selectIsAcceptingIdInput),
    isAcceptingOtpInput: useSelector(service, selectIsAcceptingOtpInput),

    INPUT_OTP: (otp: string) => service.send(AddVcModalEvents.INPUT_OTP(otp)),

    DISMISS: () => service.send(AddVcModalEvents.DISMISS()),
  };
}

export interface AddVcModalProps {
  service: ActorRefFrom<typeof AddVcModalMachine>;
  onPress?: () => void;
}
