import React from 'react';
import { Input } from 'react-native-elements';
import { DeviceInfoList } from '../../components/DeviceInfoList';
import { Button, Column } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { SelectVcOverlay } from './SelectVcOverlay';
import { MessageOverlay } from '../../components/MessageOverlay';
import { Modal, ModalProps } from '../../components/ui/Modal';
import { useSendVcModal } from './SendVcModalController';

export const SendVcModal: React.FC<SendVcModalProps> = (props) => {
  const controller = useSendVcModal();

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
            title={`Accept request and choose ${controller.vcLabel.singular}`}
            margin="12 0 12 0"
            onPress={controller.ACCEPT_REQUEST}
          />
          <Button type="clear" title="Reject" onPress={controller.CANCEL} />
        </Column>
      </Column>
      
      <SelectVcOverlay
        isVisible={controller.isSelectingVc}
        receiverName={controller.receiverInfo.deviceName}
        onSelect={controller.SELECT_VC}
        onCancel={controller.CANCEL}
        vcKeys={controller.vcKeys}
      />

      <MessageOverlay
        isVisible={controller.isSendingVc}
        title="Sharing..."
        hasProgress
      />

      <MessageOverlay
        isVisible={controller.isAccepted}
        title="Success!"
        message={`Your ${controller.vcLabel.singular} has been successfully shared with ${controller.receiverInfo.deviceName}`}
        onBackdropPress={props.onDismiss}
      />

      <MessageOverlay
        isVisible={controller.isRejected}
        title="Notice"
        message={`Your ${controller.vcLabel.singular} was rejected by ${controller.receiverInfo.deviceName}`}
        onBackdropPress={props.onDismiss}
      />
    </Modal>
  );
};

interface SendVcModalProps extends ModalProps {}
