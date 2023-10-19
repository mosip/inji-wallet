import React from 'react';
import {MessageOverlay} from '../../../components/MessageOverlay';
import {AddVcModalProps, useAddVcModal} from './AddVcModalController';
import {OtpVerificationModal} from './OtpVerificationModal';
import {IdInputModal} from './IdInputModal';
import {useTranslation} from 'react-i18next';
import {ConfirmationDialog} from '../../../components/ConfrimationDialog';
import {GET_INDIVIDUAL_ID} from '../../../shared/constants';

export const AddVcModal: React.FC<AddVcModalProps> = props => {
  const {t} = useTranslation('AddVcModal');
  const controller = useAddVcModal(props);

  const shouldShowAddVcModal = () => {
    if (controller.isRequestingCredential) {
      GET_INDIVIDUAL_ID({id: '', idType: 'UIN'});
    }
    return (
      (!controller.isAcceptingOtpInput && !controller.isRequestingCredential) ||
       !controller.isDownloadCancelled
    );
  };

  const dismissIdInputModal = () => {
    GET_INDIVIDUAL_ID({id: '', idType: 'UIN'});
    controller.DISMISS();
  };

  return (
    <React.Fragment>
      <IdInputModal
        service={props.service}
        isVisible={shouldShowAddVcModal()}
        onDismiss={dismissIdInputModal}
        onPress={props.onPress}
      />

      <OtpVerificationModal
        isVisible={controller.isAcceptingOtpInput}
        onDismiss={controller.DISMISS}
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
