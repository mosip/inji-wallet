import React from 'react';
import { Icon, Input } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { Button, Column, Row, Text } from '../../../components/ui';
import { Modal } from '../../../components/ui/Modal';
import { Theme } from '../../../components/ui/styleUtils';
import { IdInputModalProps, useIdInputModal } from './IdInputModalController';
import { useTranslation } from 'react-i18next';
import {
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { individualId } from '../../../shared/constants';
import { GET_INDIVIDUAL_ID } from '../../../shared/constants';
import { MessageOverlay } from '../../../components/MessageOverlay';

export const IdInputModal: React.FC<IdInputModalProps> = (props) => {
  const { t } = useTranslation('IdInputModal');
  const controller = useIdInputModal(props);

  const setIndividualID = () => {
    controller.INPUT_ID(individualId);
  };

  const dismissInput = () => {
    props.onDismiss();
    GET_INDIVIDUAL_ID('');
  };

  const inputLabel = t('enterId', { idType: controller.idType });

  const setIdInputRef = (node: TextInput) =>
    !controller.idInputRef && controller.READY(node);

  return (
    <Modal
      onDismiss={dismissInput}
      isVisible={props.isVisible}
      onShow={setIndividualID}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Column fill align="space-between" pY={32} pX={24}>
          <Text align="center">{t('header')}</Text>
          <Column>
            <Row crossAlign="flex-end">
              <Column
                width="33%"
                style={{
                  borderBottomWidth: 1,
                  borderColor:
                    Platform.OS === 'ios'
                      ? 'transparent'
                      : Theme.Colors.IdInputModalBorder,
                  bottom: Platform.OS === 'ios' ? 50 : 24,
                  height: Platform.OS === 'ios' ? 100 : 'auto',
                }}>
                <Picker
                  selectedValue={controller.idType}
                  onValueChange={controller.SELECT_ID_TYPE}>
                  <Picker.Item label="UIN" value="UIN" />
                  <Picker.Item label="VID" value="VID" />
                </Picker>
              </Column>
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
                  value={controller.id}
                  keyboardType="number-pad"
                  rightIcon={
                    controller.isInvalid ? (
                      <Icon
                        name="error"
                        size={18}
                        color={Theme.Colors.errorMessage}
                      />
                    ) : null
                  }
                  errorStyle={{ color: Theme.Colors.errorMessage }}
                  errorMessage={controller.idError}
                  onChangeText={controller.INPUT_ID}
                  ref={setIdInputRef}
                />
              </Column>
            </Row>
            <Button
              title={t('generateVc')}
              margin="24 0 0 0"
              onPress={controller.VALIDATE_INPUT}
              loading={controller.isRequestingOtp}
            />
            {!controller.id && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={props.onPress}
                style={Theme.Styles.getId}>
                <Text color={Theme.Colors.AddIdBtnBg}>{t('noUIN/VID')}</Text>
              </TouchableOpacity>
            )}
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
