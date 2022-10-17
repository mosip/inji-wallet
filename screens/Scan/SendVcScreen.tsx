import React from 'react';
import { Input } from 'react-native-elements';
import { DeviceInfoList } from '../../components/DeviceInfoList';
import { Button, Column, Row } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { MessageOverlay } from '../../components/MessageOverlay';
import { useSendVcScreen } from './SendVcScreenController';
import { useTranslation } from 'react-i18next';
import { VcItem } from '../../components/VcItem';
import { useSelectVcOverlay } from './SelectVcOverlayController';
import { SingleVcItem } from '../../components/SingleVcItem';
import { VerifyIdentityOverlay } from './VerifyIdentityOverlay';

export const SendVcScreen: React.FC = () => {
  const { t } = useTranslation('SendVcScreen');
  const controller = useSendVcScreen();

  const onShare = () => {
    controller.ACCEPT_REQUEST();
    controller2.onSelect();
  };

  const details = {
    isVisible: controller.isSelectingVc,
    receiverName: controller.receiverInfo.deviceName,
    onSelect: controller.SELECT_VC,
    onCancel: controller.CANCEL,
    vcKeys: controller.vcKeys,
  };

  const controller2 = useSelectVcOverlay(details);

  const reasonLabel = t('Reason For Sharing');

  return (
    <React.Fragment>
      <Column fill backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
        <Column padding="16 0" scroll>
          <DeviceInfoList of="receiver" deviceInfo={controller.receiverInfo} />
          <Column padding="24">
            <Input
              value={controller.reason ? controller.reason : ''}
              placeholder={!controller.reason ? reasonLabel : ''}
              label={controller.reason ? reasonLabel : ''}
              onChangeText={controller.UPDATE_REASON}
              containerStyle={{ marginBottom: 24 }}
            />
          </Column>
          <Column>
            {controller.vcKeys.length === 1 && (
              <SingleVcItem
                key={controller.vcKeys[0]}
                vcKey={controller.vcKeys[0]}
                margin="0 2 8 2"
                onShow={controller2.selectVcItem(0)}
                selectable
                selected={0 === controller2.selectedIndex}
              />
            )}

            {controller.vcKeys.length > 1 &&
              controller.vcKeys.map((vcKey, index) => (
                <VcItem
                  key={vcKey}
                  vcKey={vcKey}
                  margin="0 2 8 2"
                  onPress={controller2.selectVcItem(index)}
                  selectable
                  selected={index === controller2.selectedIndex}
                />
              ))}
          </Column>
        </Column>
        <Column
          backgroundColor={Theme.Colors.whiteBackgroundColor}
          padding="16 24"
          margin="2 0 0 0"
          elevation={2}>
          <Button
            title={t('AcceptRequest', { vcLabel: controller.vcLabel.singular })}
            margin="12 0 12 0"
            disabled={controller2.selectedIndex == null}
            onPress={onShare}
          />
          <Button
            type="clear"
            title={t('Reject')}
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
        onShow={controller.DISMISS}
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
