import React from 'react';
import { Input } from 'react-native-elements';
import { DeviceInfoList } from '../../components/DeviceInfoList';
import { Button, Column } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { SelectVcOverlay } from './SelectVcOverlay';
import { MessageOverlay } from '../../components/MessageOverlay';
import { Modal, ModalProps } from '../../components/ui/Modal';
import { useSendVcModal } from './SendVcModalController';
import { useTranslation } from 'react-i18next';

export const SendVcModal: React.FC<SendVcModalProps> = (props) => {
  const { t } = useTranslation('SendVcModal');
  const controller = useSendVcModal();

  const reasonLabel = t('reasonForSharing');

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
            title={t('acceptRequest', { vcLabel: controller.vcLabel.singular })}
            margin="12 0 12 0"
            onPress={controller.ACCEPT_REQUEST}
          />
          <Button
            type="clear"
            title={t('reject')}
            onPress={controller.CANCEL}
          />
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
        title={t('statusSharing.title')}
        hasProgress
      />

      <MessageOverlay
        isVisible={controller.isAccepted}
        title={t('statusAccepted.title')}
        message={t('statusAccepted.message', {
          vcLabel: controller.vcLabel.singular,
          receiver: controller.receiverInfo.deviceName,
        })}
        onBackdropPress={props.onDismiss}
      />

      <MessageOverlay
        isVisible={controller.isRejected}
        title={t('statusRejected.title')}
        message={t('statusRejected.message', {
          vcLabel: controller.vcLabel.singular,
          receiver: controller.receiverInfo.deviceName,
        })}
        onBackdropPress={props.onDismiss}
      />
    </Modal>
  );
};

type SendVcModalProps = ModalProps;
