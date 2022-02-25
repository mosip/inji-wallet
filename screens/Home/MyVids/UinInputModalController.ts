import { useContext } from 'react';
import { useSelector } from '@xstate/react';
import { selectVidLabel } from '../../../machines/settings';
import { GlobalContext } from '../../../shared/GlobalContext';
import { ActorRefFrom } from 'xstate';
import { TextInput } from 'react-native';
import { ModalProps } from '../../../components/ui/Modal';
import {
  AddVidModalEvents,
  AddVidModalMachine,
  selectIsAcceptingOtpInput,
  selectIsInvalid,
  selectIsRequestingOtp,
  selectOtpError,
  selectUin,
  selectUinError,
  selectUinInputRef,
} from './AddVidModalMachine';

export function useUinInputModal({ service }: UinInputModalProps) {
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');

  return {
    uin: useSelector(service, selectUin),
    uinInputRef: useSelector(service, selectUinInputRef),
    vidLabel: useSelector(settingsService, selectVidLabel),
    uinError: useSelector(service, selectUinError),
    otpError: useSelector(service, selectOtpError),

    isInvalid: useSelector(service, selectIsInvalid),
    isAcceptingOtpInput: useSelector(service, selectIsAcceptingOtpInput),
    isRequestingOtp: useSelector(service, selectIsRequestingOtp),

    INPUT_UIN: (uin: string) => service.send(AddVidModalEvents.INPUT_UIN(uin)),
    INPUT_OTP: (otp: string) => service.send(AddVidModalEvents.INPUT_OTP(otp)),
    VALIDATE_UIN: () => service.send(AddVidModalEvents.VALIDATE_UIN()),
    READY: (input: TextInput) => service.send(AddVidModalEvents.READY(input)),
    DISMISS: () => service.send(AddVidModalEvents.DISMISS()),
  };
}

export interface UinInputModalProps extends ModalProps {
  service: ActorRefFrom<typeof AddVidModalMachine>;
}
