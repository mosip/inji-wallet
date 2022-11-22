import React from 'react';
import { CheckBox, Input } from 'react-native-elements';
import { useTranslation } from 'react-i18next';

import { DeviceInfoList } from '../../components/DeviceInfoList';
import { Button, Column, Row } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { MessageOverlay } from '../../components/MessageOverlay';
import { useSendVcScreen } from './SendVcScreenController';
import { VerifyIdentityOverlay } from '../VerifyIdentityOverlay';
import { VcItem } from '../../components/VcItem';
import { SingleVcItem } from '../../components/SingleVcItem';

export const SendVcScreen: React.FC = () => {
  const { t } = useTranslation('SendVcScreen');
  const controller = useSendVcScreen();

  const reasonLabel = t('reasonForSharing');

  return (
    <React.Fragment>
      <Column fill backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
        <Column padding="16 0" scroll>
          <DeviceInfoList of="receiver" deviceInfo={controller.receiverInfo} />
          <CheckBox
            title={t('consentToPhotoVerification')}
            checked={controller.shouldVerifySender}
            onPress={controller.TOGGLE_USER_CONSENT}
          />
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
                onPress={controller.SELECT_VC_ITEM(0)}
                selectable
                selected={0 === controller.selectedIndex}
              />
            )}

            {controller.vcKeys.length > 1 &&
              controller.vcKeys.map((vcKey, index) => (
                <VcItem
                  key={vcKey}
                  vcKey={vcKey}
                  margin="0 2 8 2"
                  onPress={controller.SELECT_VC_ITEM(index)}
                  selectable
                  selected={index === controller.selectedIndex}
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
            title={t('acceptRequest', { vcLabel: controller.vcLabel.singular })}
            margin="12 0 12 0"
            disabled={controller.selectedIndex == null}
            onPress={controller.ACCEPT_REQUEST}
          />
          {!controller.shouldVerifySender && (
            <Button
              type="outline"
              title={t('acceptRequestAndVerify')}
              margin="12 0 12 0"
              disabled={controller.selectedIndex == null}
              onPress={controller.VERIFY_AND_ACCEPT_REQUEST}
            />
          )}
          <Button
            type="clear"
            loading={controller.isCancelling}
            title={t('reject')}
            onPress={controller.CANCEL}
          />
        </Column>
      </Column>

      <VerifyIdentityOverlay
        isVisible={controller.isVerifyingIdentity}
        vc={controller.selectedVc}
        onCancel={controller.CANCEL}
        onFaceValid={controller.FACE_VALID}
        onFaceInvalid={controller.FACE_INVALID}
      />

      <MessageOverlay
        isVisible={controller.isInvalidIdentity}
        title={t('VerifyIdentityOverlay:errors.invalidIdentity.title')}
        message={t('VerifyIdentityOverlay:errors.invalidIdentity.message')}
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
