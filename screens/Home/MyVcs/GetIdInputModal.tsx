import React from 'react';
import { Icon, Input } from 'react-native-elements';
import { Button, Column, Row, Text } from '../../../components/ui';
import { Modal } from '../../../components/ui/Modal';
import { Theme } from '../../../components/ui/styleUtils';
import {
  GetIdInputModalProps,
  useGetIdInputModal,
} from './GetIdInputModalController';
import { useTranslation } from 'react-i18next';

export const GetIdInputModal: React.FC<GetIdInputModalProps> = (props) => {
  const { t } = useTranslation('GetIdInputModal');
  const controller = useGetIdInputModal(props);

  const inputLabel = t('applicationId', {
    vcLabel: controller.vcLabel.singular,
  });

  return (
    <Modal onDismiss={props.onDismiss} isVisible={props.isVisible}>
      <Column fill align="space-between" padding="32 24">
        <Text align="center">
          {t('header', { vcLabel: controller.vcLabel.singular })}
        </Text>
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
                }}
                style={Theme.Styles.placeholder}
                value={controller.id}
                keyboardType="number-pad"
                rightIcon={
                  controller.isInvalid ? (
                    <Icon name="error" size={18} color="red" />
                  ) : (
                    <Icon name="help" size={18} />
                  )
                }
                errorStyle={{ color: Theme.Colors.errorMessage }}
                errorMessage={controller.idError}
                onChangeText={controller.INPUT_ID}
                ref={(node) => !controller.idInputRef && controller.READY(node)}
              />
            </Column>
          </Row>
          <Button
            title={t('getUIN', { vcLabel: controller.vcLabel.singular })}
            margin="24 0 0 0"
            onPress={controller.VALIDATE_INPUT}
            loading={controller.isRequestingOtp}
          />
        </Column>
      </Column>
    </Modal>
  );
};
