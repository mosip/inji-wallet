import React from 'react';
import { MessageOverlay } from '../../../components/MessageOverlay';
import { AddVidModalProps, useAddVidModal } from './AddVidModalController';
import { OtpVerificationModal } from './OtpVerificationModal';
import { IdInputModal } from './IdInputModal';

export const AddVidModal: React.FC<AddVidModalProps> = (props) => {
  const controller = useAddVidModal(props);
  
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
        onCancel={controller.DISMISS}
      />
    </React.Fragment>
  );
};
