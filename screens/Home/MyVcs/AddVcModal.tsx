import React from 'react';
import {MessageOverlay} from '../../../components/MessageOverlay';
import {AddVcModalProps, useAddVcModal} from './AddVcModalController';
import {OtpVerificationModal} from './OtpVerificationModal';
import {IdInputModal} from './IdInputModal';
import {useTranslation} from 'react-i18next';
import {ConfirmationDialog} from '../../../components/ConfrimationDialog';

export const AddVcModal: React.FC<AddVcModalProps> = props => {
  const {t} = useTranslation('AddVcModal');
  const controller = useAddVcModal(props);

  return (
    <React.Fragment>
      <IdInputModal
        service={props.service}
        isVisible={
          !controller.isAcceptingOtpInput && !controller.isRequestingCredential
        }
        onDismiss={controller.DISMISS}
        onPress={props.onPress}
      />

      <OtpVerificationModal
        isVisible={controller.isAcceptingOtpInput}
        onDismiss={controller.CANCEL_DOWNLOAD}
        onInputDone={controller.INPUT_OTP}
        error={controller.otpError}
        resend={controller.RESEND_OTP}
      />

      <MessageOverlay
        isVisible={controller.isRequestingCredential}
        title={t('requestingCredential')}
        progress
      />

      <ConfirmationDialog
        isVisible={controller.isDownloadCancelled}
        title={t('confirmationDialog.title')}
        message={t('confirmationDialog.message')}
        waitButtonText={t('confirmationDialog.wait')}
        onWaitButtonPress={controller.WAIT}
        cancelButtonText={t('confirmationDialog.cancel')}
        onCancelButtonPress={controller.CANCEL}
      />
    </React.Fragment>
  );
};
