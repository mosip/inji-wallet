import React from 'react';
import { MessageOverlay } from '../../../components/MessageOverlay';
import { AddVcModalProps, useAddVcModal } from './AddVcModalController';
import { OtpVerificationModal } from './OtpVerificationModal';
import { IdInputModal } from './IdInputModal';
import { useTranslation } from 'react-i18next';

export const AddVcModal: React.FC<AddVcModalProps> = (props) => {
  const { t } = useTranslation('AddVcModal');
  const controller = useAddVcModal(props);

  return (
    <React.Fragment>
      <IdInputModal
        service={props.service}
        isVisible={
          !controller.isAcceptingOtpInput && !controller.isRequestingCredential
        }
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
        title={t('requestingCredential')}
        progress
      />
    </React.Fragment>
  );
};
