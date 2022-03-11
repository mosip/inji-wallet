import React from 'react';
import { Icon } from 'react-native-elements';
import { TextEditOverlay } from '../../components/TextEditOverlay';
import { Column } from '../../components/ui';
import { Modal } from '../../components/ui/Modal';
import { Colors } from '../../components/ui/styleUtils';
import { VidDetails } from '../../components/VidDetails';
import { useViewVidModal, ViewVidModalProps } from './ViewVidModalController';

export const ViewVidModal: React.FC<ViewVidModalProps> = (props) => {
  const controller = useViewVidModal(props);

  return (
    <Modal
      isVisible={props.isVisible}
      onDismiss={props.onDismiss}
      headerTitle={controller.vid.tag || controller.vid.id}
      headerElevation={2}
      headerRight={
        <Icon name="edit" onPress={controller.EDIT_TAG} color={Colors.Orange} />
      }>
      <Column scroll backgroundColor={Colors.LightGrey}>
        <Column>
          <VidDetails vid={controller.vid} />
        </Column>
      </Column>

      <TextEditOverlay
        isVisible={controller.isEditingTag}
        label="Edit Tag"
        value={controller.vid.tag}
        onDismiss={controller.DISMISS}
        onSave={controller.SAVE_TAG}
      />
    </Modal>
  );
};
