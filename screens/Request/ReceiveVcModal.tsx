import React from 'react';
import { Button, Column } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { Modal, ModalProps } from '../../components/ui/Modal';
import { useReceiveVcModal } from './ReceiveVcModalController';
import { useTranslation } from 'react-i18next';

export const ReceiveVcModal: React.FC<ReceveVcModalProps> = (props) => {
  const { t } = useTranslation('ReceiveVcModal');
  const controller = useReceiveVcModal();

  return (
    <Modal
      {...props}
      onShow={() =>
        setTimeout(() => {
          props.onAccept();
        }, 5000)
      }>
      <Column scroll padding="24 0 48 0" backgroundColor={Colors.LightGrey}>
        <Column padding="0 24" margin="32 0 0 0">
          <Button
            title={t('acceptRequest', { vcLabel: controller.vcLabel.singular })}
            margin="12 0 12 0"
            onPress={props.onAccept}
          />
          <Button
            type="clear"
            title={t('reject')}
            margin="0 0 12 0"
            onPress={props.onReject}
          />
        </Column>
      </Column>
    </Modal>
  );
};

interface ReceveVcModalProps extends ModalProps {
  onAccept: () => void;
  onReject: () => void;
  onShow: () => void;
}
