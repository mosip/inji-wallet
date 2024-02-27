import {useSelector} from '@xstate/react';
import {ActorRefFrom} from 'xstate';
import {
  AddVcModalEvents,
  AddVcModalMachine,
  selectIsAcceptingOtpInput,
  selectIsRequestingCredential,
  selectOtpError,
  selectIsAcceptingIdInput,
  selectIsCancellingDownload,
  selectIsPhoneNumber,
  selectIsEmail,
} from './AddVcModalMachine';

export function useAddVcModal({service}: AddVcModalProps) {
  return {
    isRequestingCredential: useSelector(service, selectIsRequestingCredential),

    otpError: useSelector(service, selectOtpError),

    isAcceptingUinInput: useSelector(service, selectIsAcceptingIdInput),
    isAcceptingOtpInput: useSelector(service, selectIsAcceptingOtpInput),
    isDownloadCancelled: useSelector(service, selectIsCancellingDownload),
    isPhoneNumber: useSelector(service, selectIsPhoneNumber),
    isEmail: useSelector(service, selectIsEmail),

    INPUT_OTP: (otp: string) => service.send(AddVcModalEvents.INPUT_OTP(otp)),

    RESEND_OTP: () => service.send(AddVcModalEvents.RESEND_OTP()),

    DISMISS: () => service.send(AddVcModalEvents.DISMISS()),
  };
}

export interface AddVcModalProps {
  service: ActorRefFrom<typeof AddVcModalMachine>;
  onPress?: () => void;
}
