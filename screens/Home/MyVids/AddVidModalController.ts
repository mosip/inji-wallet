import { useSelector } from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import {
  AddVidModalEvents,
  AddVidModalMachine,
  selectIsAcceptingOtpInput,
  selectIsRequestingCredential,
  selectOtpError,
  selectIsAcceptingIdInput,
} from './AddVidModalMachine';

export function useAddVidModal({ service }: AddVidModalProps) {
  return {
    isRequestingCredential: useSelector(service, selectIsRequestingCredential),

    otpError: useSelector(service, selectOtpError),

    isAcceptingUinInput: useSelector(service, selectIsAcceptingIdInput),
    isAcceptingOtpInput: useSelector(service, selectIsAcceptingOtpInput),

    INPUT_OTP: (otp: string) => service.send(AddVidModalEvents.INPUT_OTP(otp)),

    DISMISS: () => service.send(AddVidModalEvents.DISMISS()),
  };
}

export interface AddVidModalProps {
  service: ActorRefFrom<typeof AddVidModalMachine>;
}
