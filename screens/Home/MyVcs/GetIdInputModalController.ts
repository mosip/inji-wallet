import { useContext } from 'react';
import { useSelector } from '@xstate/react';
import { selectVcLabel } from '../../../machines/settings';
import { GlobalContext } from '../../../shared/GlobalContext';
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
  selectIdInputRef,
} from './GetVcModalMachine';

export function useGetIdInputModal({ service }: GetIdInputModalProps) {
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');

  return {
    id: useSelector(service, selectId),
    idInputRef: useSelector(service, selectIdInputRef),
    vcLabel: useSelector(settingsService, selectVcLabel),
    idError: useSelector(service, selectIdError),
    otpError: useSelector(service, selectOtpError),

    isInvalid: useSelector(service, selectIsInvalid),
    isAcceptingOtpInput: useSelector(service, selectIsAcceptingOtpInput),
    isRequestingOtp: useSelector(service, selectIsRequestingOtp),

    INPUT_ID: (id: string) => service.send(GetVcModalEvents.INPUT_ID(id)),
    VALIDATE_INPUT: () => service.send(GetVcModalEvents.VALIDATE_INPUT()),
    INPUT_OTP: (otp: string) => service.send(GetVcModalEvents.INPUT_OTP(otp)),
    READY: (input: TextInput) => service.send(GetVcModalEvents.READY(input)),
    DISMISS: () => service.send(GetVcModalEvents.DISMISS()),
  };
}

export interface GetIdInputModalProps extends ModalProps {
  service: ActorRefFrom<typeof GetVcModalMachine>;
  onPress?: () => void;
}
