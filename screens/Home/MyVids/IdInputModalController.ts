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
  selectId,
  selectIdError,
  selectIdInputRef,
  selectIdType,
} from './AddVidModalMachine';
import { VcIdType } from '../../../types/vc';

export function useIdInputModal({ service }: IdInputModalProps) {
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');

  return {
    id: useSelector(service, selectId),
    idType: useSelector(service, selectIdType),
    idInputRef: useSelector(service, selectIdInputRef),
    vidLabel: useSelector(settingsService, selectVidLabel),
    idError: useSelector(service, selectIdError),
    otpError: useSelector(service, selectOtpError),

    isInvalid: useSelector(service, selectIsInvalid),
    isAcceptingOtpInput: useSelector(service, selectIsAcceptingOtpInput),
    isRequestingOtp: useSelector(service, selectIsRequestingOtp),

    INPUT_ID: (id: string) => service.send(AddVidModalEvents.INPUT_ID(id)),
    SELECT_ID_TYPE: (selectedValue: VcIdType) =>
      service.send(AddVidModalEvents.SELECT_ID_TYPE(selectedValue)),
    VALIDATE_INPUT: () => service.send(AddVidModalEvents.VALIDATE_INPUT()),
    INPUT_OTP: (otp: string) => service.send(AddVidModalEvents.INPUT_OTP(otp)),
    READY: (input: TextInput) => service.send(AddVidModalEvents.READY(input)),
    DISMISS: () => service.send(AddVidModalEvents.DISMISS()),
  };
}

export interface IdInputModalProps extends ModalProps {
  service: ActorRefFrom<typeof AddVidModalMachine>;
}
