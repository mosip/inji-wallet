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
} from './AddVcModalMachine';

export function useAddVcModal({service}: AddVcModalProps) {
  return {
    isRequestingCredential: useSelector(service, selectIsRequestingCredential),

    otpError: useSelector(service, selectOtpError),

    isAcceptingUinInput: useSelector(service, selectIsAcceptingIdInput),
    isAcceptingOtpInput: useSelector(service, selectIsAcceptingOtpInput),

    INPUT_OTP: (otp: string) => service.send(AddVcModalEvents.INPUT_OTP(otp)),
    isDownloadCancelled: useSelector(service, selectIsCancellingDownload),
    RESEND_OTP: () => service.send(AddVcModalEvents.RESEND_OTP()),

    DISMISS: () => service.send(AddVcModalEvents.DISMISS()),

    WAIT: () => service.send(AddVcModalEvents.WAIT()),

    CANCEL: () => service.send(AddVcModalEvents.CANCEL()),
  };
}

export interface AddVcModalProps {
  service: ActorRefFrom<typeof AddVcModalMachine>;
  onPress?: () => void;
}
