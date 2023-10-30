import React from 'react';
import {MessageOverlay} from '../../../components/MessageOverlay';
import {useGetVcModal, GetVcModalProps} from './GetVcModalController';
import {OtpVerificationModal} from './OtpVerificationModal';
import {GetIdInputModal} from './GetIdInputModal';
import {useTranslation} from 'react-i18next';
import {TelemetryConstants} from '../../../shared/telemetry/TelemetryUtils';

export const GetVcModal: React.FC<GetVcModalProps> = props => {
  const {t} = useTranslation('GetVcModal');
  const controller = useGetVcModal(props);

  return (
    <React.Fragment>
      <GetIdInputModal
        service={props.service}
        isVisible={controller.isAcceptingUinInput}
        onDismiss={controller.DISMISS}
      />

      <OtpVerificationModal
        isVisible={controller.isAcceptingOtpInput}
        onDismiss={controller.DISMISS}
        onInputDone={controller.INPUT_OTP}
        error={controller.otpError}
        flow={TelemetryConstants.FlowType.getVcUsingAid}
      />

      <MessageOverlay
        isVisible={controller.isRequestingCredential}
        title={t('retrievingId')}
        progress
      />
    </React.Fragment>
  );
};
