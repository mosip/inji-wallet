import {useSelector} from '@xstate/react';
import {ActorRefFrom} from 'xstate';
import {
  GetVcModalEvents,
  GetVcModalMachine,
  selectIsAcceptingOtpInput,
  selectIsRequestingCredential,
  selectOtpError,
  selectIsAcceptingIdInput,
} from './GetVcModalMachine';

export function useGetVcModal({service}: GetVcModalProps) {
  return {
    isRequestingCredential: useSelector(service, selectIsRequestingCredential),

    otpError: useSelector(service, selectOtpError),

    isAcceptingUinInput: useSelector(service, selectIsAcceptingIdInput),
    isAcceptingOtpInput: useSelector(service, selectIsAcceptingOtpInput),

    INPUT_OTP: (otp: string) => service.send(GetVcModalEvents.INPUT_OTP(otp)),

    RESEND_OTP: () => service.send(GetVcModalEvents.RESEND_OTP()),

    DISMISS: () => service.send(GetVcModalEvents.DISMISS()),
  };
}

export interface GetVcModalProps {
  service: ActorRefFrom<typeof GetVcModalMachine>;
  onPress?: () => void;
}
