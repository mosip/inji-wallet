import React from 'react';
import { Dimensions, I18nManager } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { Button, Centered, Column, Row, Text } from '../../../components/ui';
import { Modal } from '../../../components/ui/Modal';
import { Theme } from '../../../components/ui/styleUtils';
import {
  GetIdInputModalProps,
  useGetIdInputModal,
} from './GetIdInputModalController';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MessageOverlay } from '../../../components/MessageOverlay';
import Tooltip from '../../../lib/react-native-elements/tooltip/Tooltip';

export const GetIdInputModal: React.FC<GetIdInputModalProps> = (props) => {
  const { t } = useTranslation('GetIdInputModal');
  const controller = useGetIdInputModal(props);

  const inputLabel = t('applicationId');

  return (
    <Modal onDismiss={props.onDismiss} isVisible={props.isVisible}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Column fill align="space-between" padding="32 24">
          <Text align="center">{t('header')}</Text>
          <Column>
            <Row crossAlign="flex-end">
              <Column fill>
                <Input
                  placeholder={!controller.id ? inputLabel : ''}
                  label={controller.id ? inputLabel : ''}
                  labelStyle={{
                    color: controller.isInvalid
                      ? Theme.Colors.errorMessage
                      : Theme.Colors.textValue,
                    textAlign: 'left',
                  }}
                  inputStyle={{
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                  }}
                  selectionColor={Theme.Colors.Cursor}
                  style={Theme.Styles.placeholder}
                  value={controller.id}
                  keyboardType="number-pad"
                  rightIcon={
                    <Tooltip
                      popover={<Text>{t('qstnMarkToolTip')}</Text>}
                      width={Dimensions.get('screen').width * 0.8}
                      height={Dimensions.get('screen').height * 0.2}
                      backgroundColor={'lightgray'}
                      withPointer={true}
                      skipAndroidStatusBar={true}
                      onOpen={controller.ACTIVATE_ICON_COLOR}
                      onClose={controller.DEACTIVATE_ICON_COLOR}>
                      <Centered width={32} fill>
                        {controller.isInvalid ? (
                          <Icon
                            name="error"
                            size={18}
                            color={
                              !controller.iconColor
                                ? Theme.Colors.errorMessage
                                : Theme.Colors.Icon
                            }
                          />
                        ) : (
                          <Icon
                            name={'help'}
                            size={18}
                            color={
                              !controller.iconColor ? null : Theme.Colors.Icon
                            }
                          />
                        )}
                      </Centered>
                    </Tooltip>
                  }
                  errorStyle={{ color: Theme.Colors.errorMessage }}
                  errorMessage={controller.idError}
                  onChangeText={controller.INPUT_ID}
                  ref={(node) =>
                    !controller.idInputRef && controller.READY(node)
                  }
                />
              </Column>
            </Row>
            <Button
              title={t('getUIN')}
              margin="24 0 0 0"
              onPress={controller.VALIDATE_INPUT}
              loading={controller.isRequestingOtp}
            />
          </Column>
        </Column>
        <MessageOverlay
          isVisible={controller.isRequestingOtp}
          title={t('requestingOTP')}
          progress
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};
