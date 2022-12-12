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

import { OtpVerification } from './MyVcs/OtpVerification';
import { BindStatus } from './MyVcs/BindVcStatus';

export const ViewVcModal: React.FC<ViewVcModalProps> = (props) => {
  const { t } = useTranslation('ViewVcModal');
  const controller = useViewVcModal(props);

  const DATA = [
    {
      idType: 'UIN',
      label: controller.vc.locked ? t('unlock') : t('lock'),
      icon: 'lock-outline',
      onPress: () => controller.lockVc(),
    },
    {
      idType: 'VID',
      label: t('revoke'),
      icon: 'close-circle-outline',
      onPress: () => controller.CONFIRM_REVOKE_VC(),
    },
    {
      label: t('editTag'),
      icon: 'pencil',
      onPress: () => controller.EDIT_TAG(),
    },
  ];

  return (
    <Modal
      isVisible={props.isVisible}
      onDismiss={props.onDismiss}
      headerTitle={controller.vc.id}
      headerElevation={2}
      headerRight={
        <DropdownIcon
          icon="dots-vertical"
          idType={controller.vc.idType}
          items={DATA}
        />
      }>
      <Column scroll>
        <Column fill>
          <VcDetails
            vc={controller.vc}
            onBinding={controller.addtoWallet}
            isBindingPending={controller.isWalletBindingPending}
          />

          {controller.walletBindingError !== '' && (
            <Text style={{ color: 'red', fontSize: 20 }}>
              Error Occured : {controller.walletBindingError}
            </Text>
          )}
        </Column>
      </Column>
      {controller.isEditingTag && (
        <TextEditOverlay
          isVisible={controller.isEditingTag}
          label={t('editTag')}
          value={controller.vc.tag}
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
        <OtpVerification
          isVisible={controller.isAcceptingOtpInput}
          onDismiss={controller.DISMISS}
          onInputDone={controller.inputOtp}
          error={controller.otpError}
        />
      )}

      {controller.isAcceptingBindingOtp && (
        <OtpVerification
          isVisible={controller.isAcceptingBindingOtp}
          onDismiss={controller.DISMISS}
          onInputDone={controller.inputOtp}
          error={controller.otpError}
        />
      )}

      {controller.showBindingStatus && (
        <BindStatus
          isVisible={controller.showBindingStatus}
          bindingError={controller.walletBindingError}
          onDismiss={controller.DISMISS}
          onDone={controller.BINDING_DONE}
        />
      )}

      <MessageOverlay
        isVisible={controller.isRequestingOtp}
        title={t('requestingOtp')}
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
