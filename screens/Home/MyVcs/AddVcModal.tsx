import React from 'react';
import {MessageOverlay} from '../../../components/MessageOverlay';
import {AddVcModalProps, useAddVcModal} from './AddVcModalController';
import {OtpVerificationModal} from './OtpVerificationModal';
import {IdInputModal} from './IdInputModal';
import {useTranslation} from 'react-i18next';
import {GET_INDIVIDUAL_ID} from '../../../shared/constants';
import {TelemetryConstants} from '../../../shared/telemetry/TelemetryConstants';

export const AddVcModal: React.FC<AddVcModalProps> = props => {
  const {t} = useTranslation('AddVcModal');
  const controller = useAddVcModal(props);

  const shouldShowAddVcModal = () => {
    if (controller.isRequestingCredential) {
      GET_INDIVIDUAL_ID({id: '', idType: 'UIN'});
    }
    return controller.isAcceptingUinInput;
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

      {(controller.isAcceptingOtpInput || controller.isDownloadCancelled) && (
        <OtpVerificationModal
          service={props.service}
          isVisible={
            controller.isAcceptingOtpInput || controller.isDownloadCancelled
          }
          onDismiss={controller.DISMISS}
          onInputDone={controller.INPUT_OTP}
          error={controller.otpError}
          resend={controller.RESEND_OTP}
          phone={controller.isPhoneNumber}
          email={controller.isEmail}
          flow={TelemetryConstants.FlowType.vcDownload}
        />
      )}

      <MessageOverlay
        isVisible={controller.isRequestingCredential}
        title={t('requestingCredential')}
        progress
      />
    </React.Fragment>
  );
};
