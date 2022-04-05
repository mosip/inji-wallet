import React from 'react';
import { Icon } from 'react-native-elements';
import { TextEditOverlay } from '../../components/TextEditOverlay';
import { Column } from '../../components/ui';
import { Modal } from '../../components/ui/Modal';
import { Colors } from '../../components/ui/styleUtils';
import { VcDetails } from '../../components/VcDetails';
import { useViewVcModal, ViewVcModalProps } from './ViewVcModalController';

export const ViewVcModal: React.FC<ViewVcModalProps> = (props) => {
  const controller = useViewVcModal(props);

  return (
    <Modal
      isVisible={props.isVisible}
      onDismiss={props.onDismiss}
      headerTitle={controller.vc.tag || controller.vc.id}
      headerElevation={2}
      headerRight={
        <Icon name="edit" onPress={controller.EDIT_TAG} color={Colors.Orange} />
      }>
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
