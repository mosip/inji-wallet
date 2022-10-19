import React from 'react';
import { Input } from 'react-native-elements';
import { DeviceInfoList } from '../../components/DeviceInfoList';
import { Button, Column, Row } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { SelectVcOverlay } from './SelectVcOverlay';
import { MessageOverlay } from '../../components/MessageOverlay';
import { useSendVcScreen } from './SendVcScreenController';
import { useTranslation } from 'react-i18next';
import { VerifyIdentityOverlay } from './VerifyIdentityOverlay';

export const SendVcScreen: React.FC = () => {
  const { t } = useTranslation('SendVcScreen');
  const controller = useSendVcScreen();

  const reasonLabel = t('reasonForSharing');

  return (
    <React.Fragment>
      <Column fill backgroundColor={Colors.LightGrey}>
        <Column padding="16 0" scroll>
          <DeviceInfoList of="receiver" deviceInfo={controller.receiverInfo} />
          <Column padding="24">
            <Input
              placeholder={reasonLabel}
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
            loading={controller.isCancelling}
            title={t('reject')}
            onPress={controller.CANCEL}
          />
        </Column>
      </Column>

      <SelectVcOverlay
        isVisible={controller.isSelectingVc}
        receiverName={controller.receiverInfo.deviceName}
        onSelect={controller.SELECT_VC}
        onVerifyAndSelect={controller.VERIFY_AND_SELECT_VC}
        onCancel={controller.CANCEL}
        vcKeys={controller.vcKeys}
      />

      <VerifyIdentityOverlay
        isVisible={controller.isVerifyingUserIdentity}
        onCancel={controller.CANCEL}
        onFaceValid={controller.FACE_VALID}
        onFaceInvalid={controller.FACE_INVALID}
      />

      <MessageOverlay
        isVisible={controller.isInvalidUserIdentity}
        title={t('errors.invalidIdentity.title')}
        message={t('errors.invalidIdentity.message')}
        onBackdropPress={controller.DISMISS}>
        <Row>
          <Button
            fill
            type="clear"
            title={t('common:cancel')}
            onPress={controller.DISMISS}
            margin={[0, 8, 0, 0]}
          />
          <Button
            fill
            title={t('common:tryAgain')}
            onPress={controller.RETRY_VERIFICATION}
          />
        </Row>
      </MessageOverlay>

      <MessageOverlay
        isVisible={controller.isSendingVc}
        title={t('status.sharing.title')}
        hint={
          controller.isSendingVcTimeout ? t('status.sharing.timeoutHint') : null
        }
        onCancel={controller.isSendingVcTimeout ? controller.CANCEL : null}
        progress
      />

      <MessageOverlay
        isVisible={controller.status != null}
        title={controller.status?.title}
        hint={controller.status?.hint}
        onCancel={controller.status?.onCancel}
        progress
      />

      <MessageOverlay
        isVisible={controller.isAccepted}
        title={t('status.accepted.title')}
        message={t('status.accepted.message', {
          vcLabel: controller.vcLabel.singular,
          receiver: controller.receiverInfo.deviceName,
        })}
        onBackdropPress={controller.DISMISS}
      />

      <MessageOverlay
        isVisible={controller.isRejected}
        title={t('status.rejected.title')}
        message={t('status.rejected.message', {
          vcLabel: controller.vcLabel.singular,
          receiver: controller.receiverInfo.deviceName,
        })}
        onBackdropPress={controller.DISMISS}
      />
    </React.Fragment>
  );
};
