import React from 'react';
import { TextEditOverlay } from '../../components/TextEditOverlay';
import { Column } from '../../components/ui';
import { Modal } from '../../components/ui/Modal';
import { Colors } from '../../components/ui/styleUtils';
import { VcDetails } from '../../components/VcDetails';
import { DropdownIcon } from '../../components/DropdownIcon';
import { useViewVcModal, ViewVcModalProps } from './ViewVcModalController';

export const ViewVcModal: React.FC<ViewVcModalProps> = (props) => {
  const controller = useViewVcModal(props);

  const DATA = [
    {
      label: 'Lock',
      icon: 'lock-outline',
      onPress: () => lockVc(),
    },
    {
      label: 'Rename',
      icon: 'pencil-outline',
      onPress: () => controller.EDIT_TAG(),
    },
    {
      label: 'Revoke',
      icon: 'close-circle-outline',
    },
    {
      label: 'Delete',
      icon: 'delete-outline',
    },
  ];

  const lockVc = () => {
    controller.LOCKING_VC();
  };

  return (
    <Modal
      isVisible={props.isVisible}
      onDismiss={props.onDismiss}
      headerTitle={controller.vc.tag || controller.vc.id}
      headerElevation={2}
      headerRight={<DropdownIcon icon="dots-vertical" items={DATA} />}>
      <Column scroll backgroundColor={Colors.LightGrey}>
        <Column>
          <VcDetails vc={controller.vc} />
        </Column>
      </Column>

      <TextEditOverlay
        isVisible={controller.isEditingTag}
        label="Edit Tag"
        value={controller.vc.tag}
        onDismiss={controller.DISMISS}
        onSave={controller.SAVE_TAG}
      />
    </Modal>
  );
};
