import { useContext } from 'react';
import { useSelector } from '@xstate/react';
import { selectVcLabel } from '../../../machines/settings';
import { GlobalContext } from '../../../shared/GlobalContext';
import { ActorRefFrom } from 'xstate';
import { TextInput } from 'react-native';
import { ModalProps } from '../../../components/ui/Modal';
import {
  AddVcModalEvents,
  AddVcModalMachine,
  selectIsAcceptingOtpInput,
  selectIsInvalid,
  selectIsRequestingOtp,
  selectOtpError,
  selectId,
  selectIdError,
  selectIdInputRef,
  selectIdType,
} from './AddVcModalMachine';
import { VcIdType } from '../../../types/vc';

export function useIdInputModal({ service }: IdInputModalProps) {
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');

  return {
    id: useSelector(service, selectId),
    idType: useSelector(service, selectIdType),
    idInputRef: useSelector(service, selectIdInputRef),
    vcLabel: useSelector(settingsService, selectVcLabel),
    idError: useSelector(service, selectIdError),
    otpError: useSelector(service, selectOtpError),

    isInvalid: useSelector(service, selectIsInvalid),
    isAcceptingOtpInput: useSelector(service, selectIsAcceptingOtpInput),
    isRequestingOtp: useSelector(service, selectIsRequestingOtp),

    INPUT_ID: (id: string) => service.send(AddVcModalEvents.INPUT_ID(id)),
    SELECT_ID_TYPE: (selectedValue: VcIdType) =>
      service.send(AddVcModalEvents.SELECT_ID_TYPE(selectedValue)),
    VALIDATE_INPUT: () => service.send(AddVcModalEvents.VALIDATE_INPUT()),
    INPUT_OTP: (otp: string) => service.send(AddVcModalEvents.INPUT_OTP(otp)),
    READY: (input: TextInput) => service.send(AddVcModalEvents.READY(input)),
    DISMISS: () => service.send(AddVcModalEvents.DISMISS()),
  };
}

export interface IdInputModalProps extends ModalProps {
  service: ActorRefFrom<typeof AddVcModalMachine>;
}
