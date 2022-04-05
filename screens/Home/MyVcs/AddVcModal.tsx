import React from 'react';
import { MessageOverlay } from '../../../components/MessageOverlay';
import { AddVcModalProps, useAddVcModal } from './AddVcModalController';
import { OtpVerificationModal } from './OtpVerificationModal';
import { IdInputModal } from './IdInputModal';

export const AddVcModal: React.FC<AddVcModalProps> = (props) => {
  const controller = useAddVcModal(props);
  
  return (
    <React.Fragment>
      <IdInputModal
        service={props.service}
        isVisible={true}
        onDismiss={controller.DISMISS}
      />

      <OtpVerificationModal
        isVisible={controller.isAcceptingOtpInput}
        onDismiss={controller.DISMISS}
        onInputDone={controller.INPUT_OTP}
        error={controller.otpError}
      />

      <MessageOverlay
        isVisible={controller.isRequestingCredential}
        title="Requesting credential..."
        hasProgress
      />
    </React.Fragment>
  );
};
