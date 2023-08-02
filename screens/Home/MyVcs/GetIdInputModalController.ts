import { useSelector } from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import { TextInput } from 'react-native';
import { ModalProps } from '../../../components/ui/Modal';
import {
  GetVcModalEvents,
  GetVcModalMachine,
  selectIsAcceptingOtpInput,
  selectIsInvalid,
  selectIsRequestingOtp,
  selectOtpError,
  selectId,
  selectIdError,
  selectIconColor,
  selectIdInputRef,
} from './GetVcModalMachine';

export function useGetIdInputModal({ service }: GetIdInputModalProps) {
  return {
    id: useSelector(service, selectId),
    idInputRef: useSelector(service, selectIdInputRef),
    idError: useSelector(service, selectIdError),
    otpError: useSelector(service, selectOtpError),
    iconColor: useSelector(service, selectIconColor),

    isInvalid: useSelector(service, selectIsInvalid),
    isAcceptingOtpInput: useSelector(service, selectIsAcceptingOtpInput),
    isRequestingOtp: useSelector(service, selectIsRequestingOtp),

    INPUT_ID: (id: string) => service.send(GetVcModalEvents.INPUT_ID(id)),
    VALIDATE_INPUT: () => service.send(GetVcModalEvents.VALIDATE_INPUT()),
    ACTIVATE_ICON_COLOR: () =>
      service.send(GetVcModalEvents.ACTIVATE_ICON_COLOR()),
    DEACTIVATE_ICON_COLOR: () =>
      service.send(GetVcModalEvents.DEACTIVATE_ICON_COLOR()),
    INPUT_OTP: (otp: string) => service.send(GetVcModalEvents.INPUT_OTP(otp)),
    READY: (input: TextInput) => service.send(GetVcModalEvents.READY(input)),
    DISMISS: () => service.send(GetVcModalEvents.DISMISS()),
  };
}

export interface GetIdInputModalProps extends ModalProps {
  service: ActorRefFrom<typeof GetVcModalMachine>;
  onPress?: () => void;
}
