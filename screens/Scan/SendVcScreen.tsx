import React, { useContext, useEffect, useRef } from 'react';
import { CheckBox, Input } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { Button, Column, Row, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { MessageOverlay } from '../../components/MessageOverlay';
import { useSendVcScreen } from './SendVcScreenController';
import { VerifyIdentityOverlay } from '../VerifyIdentityOverlay';
import { VcItem } from '../../components/VcItem';
import { I18nManager, BackHandler } from 'react-native';
import { useInterpret } from '@xstate/react';
import { createVcItemMachine } from '../../machines/vcItem';
import { GlobalContext } from '../../shared/GlobalContext';
import { useFocusEffect } from '@react-navigation/native';

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
        <Column>
          <Column
            padding="24 19 14 19"
            backgroundColor={Theme.Colors.whiteBackgroundColor}
            style={{ position: 'relative' }}>
            <Input
              value={controller.reason ? controller.reason : ''}
              placeholder={!controller.reason ? reasonLabel : ''}
              label={controller.reason ? reasonLabel : ''}
              labelStyle={{ textAlign: 'left' }}
              onChangeText={controller.UPDATE_REASON}
              containerStyle={{ marginBottom: 6 }}
              inputStyle={{ textAlign: I18nManager.isRTL ? 'right' : 'left' }}
            />

            <CheckBox
              containerStyle={Theme.SelectVcOverlayStyles.consentCheckContainer}
              title={t('consentToPhotoVerification')}
              checked={controller.selectedVc.shouldVerifyPresence}
              onPress={controller.TOGGLE_USER_CONSENT}
            />
          </Column>
          <Text
            margin="15 0 13 24"
            weight="bold"
            color={Theme.Colors.textValue}
            style={{ position: 'relative' }}>
            {t('pleaseSelectAnId')}
          </Text>
        </Column>
        <Column scroll>
          {controller.vcKeys.map((vcKey, index) => (
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

        <Column padding="12 0" elevation={2}>
          <Button
            type="gradient"
            title={t('acceptRequest')}
            disabled={controller.selectedIndex == null}
            onPress={controller.ACCEPT_REQUEST}
          />
          {!controller.selectedVc.shouldVerifyPresence && (
            <Button
              type="gradient"
              title={t('acceptRequestAndVerify')}
              styles={{ marginTop: '12' }}
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
