import React from 'react';
import { Input } from 'react-native-elements';
import { DeviceInfoList } from '../../components/DeviceInfoList';
import { Button, Column } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { SelectVidOverlay } from './SelectVidOverlay';
import { MessageOverlay } from '../../components/MessageOverlay';
import { Modal, ModalProps } from '../../components/ui/Modal';
import { useSendVidModal } from './SendVidModalController';

export const SendVidModal: React.FC<SendVidModalProps> = (props) => {
  const controller = useSendVidModal();

  const reasonLabel = 'Reason for sharing (optional)';

  return (
    <Modal {...props}>
      <Column fill backgroundColor={Colors.LightGrey}>
        <Column padding="16 0" scroll>
          <DeviceInfoList of="receiver" deviceInfo={controller.receiverInfo} />
          <Column padding="24">
            <Input
              placeholder={!controller.reason ? reasonLabel : ''}
              label={controller.reason ? reasonLabel : ''}
              onChangeText={controller.UPDATE_REASON}
              containerStyle={{ marginBottom: 24 }}
            />
          </Column>
        </Column>
        <Column
          backgroundColor={Colors.White}
          padding="16 24"
          margin="2 0 0 0"
          elevation={2}>
          <Button
            title={`Accept request and choose ${controller.vidLabel.singular}`}
            margin="12 0 12 0"
            onPress={controller.ACCEPT_REQUEST}
          />
          <Button type="clear" title="Reject" onPress={controller.CANCEL} />
        </Column>
      </Column>

      <SelectVidOverlay
        isVisible={controller.isSelectingVid}
        receiverName={controller.receiverInfo.deviceName}
        onSelect={controller.SELECT_VID}
        onCancel={controller.CANCEL}
        vidKeys={controller.vidKeys}
      />

      <MessageOverlay
        isVisible={controller.isSendingVid}
        title="Sharing..."
        hasProgress
      />

      <MessageOverlay
        isVisible={controller.isAccepted}
        title="Success!"
        message={`Your ${controller.vidLabel.singular} has been successfully shared with ${controller.receiverInfo.deviceName}`}
        onBackdropPress={props.onDismiss}
      />

      <MessageOverlay
        isVisible={controller.isRejected}
        title="Notice"
        message={`Your ${controller.vidLabel.singular} was rejected by ${controller.receiverInfo.deviceName}`}
        onBackdropPress={props.onDismiss}
      />
    </Modal>
  );
};

interface SendVidModalProps extends ModalProps {}
