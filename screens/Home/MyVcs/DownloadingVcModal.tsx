import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Column, Text } from '../../../components/ui';
import { Modal, ModalProps } from '../../../components/ui/Modal';

export const DownloadingVcModal: React.FC<ModalProps> = (props) => {
  const { t } = useTranslation('DownloadingVcModal');

  return (
    <Modal
      isVisible={props.isVisible}
      onDismiss={props.onDismiss}
      onShow={props.onShow}>
      <Column fill pY={32} pX={24} align="space-between">
        <Column fill>
          <Text weight="semibold" align="center">
            {t('header')}
          </Text>
          <Text align="center">{t('bodyText')}</Text>
        </Column>
        <Column fill align="flex-end">
          <Button title={t('backButton')} onPress={props.onDismiss} />
        </Column>
      </Column>
    </Modal>
  );
};
