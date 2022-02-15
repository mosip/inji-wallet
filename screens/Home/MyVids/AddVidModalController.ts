import { useSelector } from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import {
  AddVidModalEvents,
  AddVidModalMachine,
  selectIsAcceptingOtpInput,
  selectIsRequestingCredential,
  selectIsRequestSuccessful,
  selectOtpError,
  selectIsAcceptingUinInput,
} from './AddVidModalMachine';

export function useAddVidModal({ service }: AddVidModalProps) {
  return {
    isRequestingCredential: useSelector(service, selectIsRequestingCredential),
    isRequestSuccessful: useSelector(service, selectIsRequestSuccessful),

    otpError: useSelector(service, selectOtpError),

    isAcceptingUinInput: useSelector(service, selectIsAcceptingUinInput),
    isAcceptingOtpInput: useSelector(service, selectIsAcceptingOtpInput),

    INPUT_OTP: (otp: string) => service.send(AddVidModalEvents.INPUT_OTP(otp)),

    DISMISS: () => service.send(AddVidModalEvents.DISMISS()),
  };
}

export interface AddVidModalProps {
  service: ActorRefFrom<typeof AddVidModalMachine>;
}
