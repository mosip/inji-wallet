import React, { useContext, useEffect, useRef } from 'react';
import { CheckBox, Input } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { DeviceInfoList } from '../../components/DeviceInfoList';
import { Button, Column, Row } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { MessageOverlay } from '../../components/MessageOverlay';
import { useSendVcScreen } from './SendVcScreenController';
import { VerifyIdentityOverlay } from '../VerifyIdentityOverlay';
import { VcItem } from '../../components/VcItem';
import { I18nManager, BackHandler } from 'react-native';
import { useInterpret } from '@xstate/react';
import { createVcItemMachine } from '../../machines/vcItem';
import { GlobalContext } from '../../shared/GlobalContext';

export const SendVcScreen: React.FC = () => {
  const { t } = useTranslation('SendVcScreen');
  const { appService } = useContext(GlobalContext);
  const controller = useSendVcScreen();
  let service;

  if (controller.vcKeys?.length > 0) {
    const firstVCMachine = useRef(
      createVcItemMachine(
        appService.getSnapshot().context.serviceRefs,
        controller.vcKeys[0]
      )
    );

    service = useInterpret(firstVCMachine.current);
  }

  useEffect(() => {
    if (service) {
      controller.SELECT_VC_ITEM(0)(service);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;

      const disableBackHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => disableBackHandler.remove();
    }, [])
  );

  const reasonLabel = t('reasonForSharing');

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
              labelStyle={{ textAlign: 'left' }}
              onChangeText={controller.UPDATE_REASON}
              containerStyle={{ marginBottom: 24 }}
              inputStyle={{ textAlign: I18nManager.isRTL ? 'right' : 'left' }}
              selectionColor={Theme.Colors.Cursor}
            />
          </Column>
          <Column>
            {controller.vcKeys.map((vcKey, index) => (
              <VcItem
                key={vcKey}
                vcKey={vcKey}
                margin="0 2 8 2"
                onPress={controller.SELECT_VC_ITEM(index)}
                selectable
                selected={index === controller.selectedIndex}
                activeTab={'sharingVcScreen'}
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
            title={t('acceptRequest')}
            margin="12 0 12 0"
            disabled={controller.selectedIndex == null}
            onPress={controller.ACCEPT_REQUEST}
          />
          {!controller.selectedVc.shouldVerifyPresence && (
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
    </React.Fragment>
  );
};
