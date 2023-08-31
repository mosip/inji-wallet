import React from 'react';
import { DropdownIcon } from '../../components/DropdownIcon';
import { TextEditOverlay } from '../../components/TextEditOverlay';
import { Column, Text } from '../../components/ui';
import { Modal } from '../../components/ui/Modal';
import { MessageOverlay } from '../../components/MessageOverlay';
import { ToastItem } from '../../components/ui/ToastItem';
import { RevokeConfirmModal } from '../../components/RevokeConfirm';
import { OIDcAuthenticationModal } from '../../components/OIDcAuth';
import { useViewVcModal, ViewVcModalProps } from './ViewVcModalController';
import { useTranslation } from 'react-i18next';
import { VcDetails } from '../../components/VcDetails';
import { OtpVerificationModal } from './MyVcs/OtpVerificationModal';
import { BindingVcWarningOverlay } from './MyVcs/BindingVcWarningOverlay';

export const ViewVcModal: React.FC<ViewVcModalProps> = (props) => {
  const { t } = useTranslation('ViewVcModal');
  const controller = useViewVcModal(props);

  const DATA = [
    {
      idType: 'VID',
      label: t('revoke'),
      icon: 'close-circle-outline',
      onPress: controller.CONFIRM_REVOKE_VC,
    },
    {
      label: t('editTag'),
      icon: 'pencil',
      onPress: controller.EDIT_TAG,
    },
  ];

  return (
    <Modal
      isVisible={props.isVisible}
      onDismiss={props.onDismiss}
      headerTitle={t('title')}
      headerElevation={2}>
      <Column scroll>
        <Column fill>
          <VcDetails
            vc={controller.vc}
            onBinding={controller.addtoWallet}
            isBindingPending={controller.isWalletBindingPending}
            activeTab={props.activeTab}
          />
        </Column>
      </Column>
      {controller.isEditingTag && (
        <TextEditOverlay
          isVisible={controller.isEditingTag}
          label={t('editTag')}
          value={controller.vc.tag}
          maxLength={12}
          onDismiss={controller.DISMISS}
          onSave={controller.SAVE_TAG}
        />
      )}

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
        />
      )}

      {controller.isAcceptingBindingOtp && (
        <OtpVerificationModal
          isVisible={controller.isAcceptingBindingOtp}
          onDismiss={controller.DISMISS}
          onInputDone={controller.inputOtp}
          error={controller.otpError}
        />
      )}

      <BindingVcWarningOverlay
        isVisible={controller.isBindingWarning}
        onConfirm={controller.CONFIRM}
        onCancel={controller.CANCEL}
      />

      <MessageOverlay
        isVisible={controller.isBindingError}
        title={controller.walletBindingError}
        onCancel={() => {
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
