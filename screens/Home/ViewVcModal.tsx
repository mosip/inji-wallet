import React, {useEffect} from 'react';
import {Column} from '../../components/ui';
import {Modal} from '../../components/ui/Modal';
import {MessageOverlay} from '../../components/MessageOverlay';
import {ToastItem} from '../../components/ui/ToastItem';
import {RevokeConfirmModal} from '../../components/RevokeConfirm';
import {OIDcAuthenticationModal} from '../../components/OIDcAuth';
import {useViewVcModal, ViewVcModalProps} from './ViewVcModalController';
import {useTranslation} from 'react-i18next';
import {BannerNotification} from '../../components/BannerNotification';
import {OtpVerificationModal} from './MyVcs/OtpVerificationModal';
import {BindingVcWarningOverlay} from './MyVcs/BindingVcWarningOverlay';
import {VcDetailsContainer} from '../../components/VC/VcDetailsContainer';
import {
  TelemetryConstants,
  getEndEventData,
  getErrorEventData,
  sendEndEvent,
  sendErrorEvent,
} from '../../shared/telemetry/TelemetryUtils';

export const ViewVcModal: React.FC<ViewVcModalProps> = props => {
  const {t} = useTranslation('ViewVcModal');
  const controller = useViewVcModal(props);
  let bindingError: string = controller.walletBindingError.includes(
    'binding_auth_failed',
  )
    ? controller.walletBindingError.split('-')[1]
    : controller.walletBindingError;

  const DATA = [
    {
      idType: 'VID',
      label: t('revoke'),
      icon: 'close-circle-outline',
      onPress: controller.CONFIRM_REVOKE_VC,
    },
  ];

  useEffect(() => {
    if (bindingError) {
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.vcActivation,
          TelemetryConstants.ErrorId.activationFailed,
          controller.walletBindingError,
        ),
      );
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.vcActivation,
          TelemetryConstants.EndEventStatus.failure,
        ),
      );
    }
  }, [controller.walletBindingError]);

  return (
    <Modal
      isVisible={props.isVisible}
      onDismiss={props.onDismiss}
      headerTitle={t('title')}
      headerElevation={2}>
      {controller.isBindingSuccess && (
        <BannerNotification
          message={t('activated')}
          onClosePress={controller.DISMISS}
          testId={'activatedVcPopup'}
        />
      )}
      <Column scroll>
        <Column fill>
          <VcDetailsContainer
            vc={controller.vc}
            onBinding={controller.addtoWallet}
            isBindingPending={controller.isWalletBindingPending}
            activeTab={props.activeTab}
          />
        </Column>
      </Column>

      {controller.isAcceptingRevokeInput && (
        <OIDcAuthenticationModal
          isVisible={controller.isAcceptingRevokeInput}
          onDismiss={controller.DISMISS}
          onVerify={() => {
            controller.revokeVc('111111');
          }}
          error={controller.otpError}
        />
      )}

      {controller.isAcceptingOtpInput && (
        <OtpVerificationModal
          isVisible={controller.isAcceptingOtpInput}
          onDismiss={controller.DISMISS}
          onInputDone={controller.inputOtp}
          error={controller.otpError}
          resend={controller.RESEND_OTP}
          flow={TelemetryConstants.FlowType.vcLockOrRevoke}
        />
      )}

      {controller.isAcceptingBindingOtp && (
        <OtpVerificationModal
          isVisible={controller.isAcceptingBindingOtp}
          onDismiss={controller.DISMISS}
          onInputDone={controller.inputOtp}
          error={controller.otpError}
          resend={controller.RESEND_OTP}
          flow={TelemetryConstants.FlowType.vcActivation}
        />
      )}

      <BindingVcWarningOverlay
        isVisible={controller.isBindingWarning}
        onConfirm={controller.CONFIRM}
        onCancel={controller.CANCEL}
      />

      <MessageOverlay
        isVisible={controller.isBindingError}
        title={bindingError}
        onButtonPress={() => {
          controller.CANCEL();
        }}
      />

      <MessageOverlay
        isVisible={controller.isWalletBindingInProgress}
        title={t('inProgress')}
        progress
      />

      {controller.isRevoking && (
        <RevokeConfirmModal
          id={controller.vc.id}
          onCancel={() => controller.setRevoking(false)}
          onRevoke={controller.REVOKE_VC}
        />
      )}

      {controller.toastVisible && <ToastItem message={controller.message} />}
    </Modal>
  );
};
