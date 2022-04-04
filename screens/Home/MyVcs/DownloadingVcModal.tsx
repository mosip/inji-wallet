import React from 'react';
import { Button, Column, Text } from '../../../components/ui';
import { Modal, ModalProps } from '../../../components/ui/Modal';
import { useDownloadingVcModal } from './DownloadingVcModalController';

export const DownloadingVcModal: React.FC<ModalProps> = (props) => {
  const controller = useDownloadingVcModal();

  return (
    <Modal isVisible={props.isVisible} onDismiss={props.onDismiss}>
      <Column fill padding="32 24" align="space-between">
        <Column fill>
          <Text weight="semibold" align="center">
            Downloading your {controller.vcLabel.singular}
          </Text>
          <Text align="center">
            This may take some time, we will{'\n'}notify you when your{' '}
            {controller.vcLabel.singular} has been{'\n'}downloaded and is
            available
          </Text>
        </Column>
        <Column fill align="flex-end">
          <Button title="Back home" onPress={props.onDismiss} />
        </Column>
      </Column>
    </Modal>
  );
};
