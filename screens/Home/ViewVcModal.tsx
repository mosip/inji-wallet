import React from 'react';
import { DropdownIcon } from '../../components/DropdownIcon';
import { TextEditOverlay } from '../../components/TextEditOverlay';
import { Column } from '../../components/ui';
import { Modal } from '../../components/ui/Modal';
import { Colors } from '../../components/ui/styleUtils';
import { VcDetails } from '../../components/VcDetails';
import { MessageOverlay } from '../../components/MessageOverlay';
import { ToastItem } from '../../components/ui/ToastItem';
import { Passcode } from '../../components/Passcode';
import { OtpVerificationModal } from './MyVcs/OtpVerificationModal';
import { useViewVcModal, ViewVcModalProps } from './ViewVcModalController';
import { useTranslation } from 'react-i18next';

export const ViewVcModal: React.FC<ViewVcModalProps> = (props) => {
  const { t } = useTranslation('ViewVcModal');
  const controller = useViewVcModal(props);

  const DATA = [
    {
      idType: 'VID',
      label: t('revoke'),
      icon: 'close-circle-outline',
      onPress: () => controller.REVOKE_VC(),
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
      headerTitle={controller.vc.tag || controller.vc.id}
      headerElevation={2}
      headerRight={
        <DropdownIcon
          icon="dots-vertical"
          items={controller.getData(DATA, controller.vc.idType)}
        />
      }>
      <Column scroll backgroundColor={Colors.LightGrey}>
        <Column>
          <VcDetails vc={controller.vc} />
        </Column>
      </Column>

      <TextEditOverlay
        isVisible={controller.isEditingTag}
        label={t('editTag')}
        value={controller.vc.tag}
        onDismiss={controller.DISMISS}
        onSave={controller.SAVE_TAG}
      />

      <OtpVerificationModal
        isVisible={controller.isAcceptingOtpInput}
        onDismiss={controller.DISMISS}
        onInputDone={controller.inputOtp}
        error={controller.otpError}
      />

      <MessageOverlay
        isVisible={controller.isRequestingOtp}
        title={t('requestingOtp')}
        hasProgress
      />

      {controller.reAuthenticating !== '' &&
        controller.reAuthenticating == 'passcode' && (
          <Passcode
            onSuccess={() => controller.onSuccess()}
            onError={(value) => controller.onError(value)}
            storedPasscode={controller.storedPasscode}
            onDismiss={() => controller.setReAuthenticating('')}
            error={controller.error}
          />
        )}
      {controller.toastVisible && <ToastItem message={controller.message} />}
    </Modal>
  );
};
