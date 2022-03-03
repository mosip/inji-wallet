import React from 'react';
import { Icon, Input } from 'react-native-elements';
import { Button, Column, Text } from '../../../components/ui';
import { Modal } from '../../../components/ui/Modal';
import { Colors } from '../../../components/ui/styleUtils';
import {
  UinInputModalProps,
  useUinInputModal,
} from './UinInputModalController';

export const UinInputModal: React.FC<UinInputModalProps> = (props) => {
  const controller = useUinInputModal(props);
  const inputLabel = 'UIN or VID';

  return (
    <Modal onDismiss={props.onDismiss} isVisible={props.isVisible}>
      <Column fill align="space-between" padding="32 24">
        <Text align="center">
          Enter the MOSIP-provided UIN or VID{'\n'}of the{' '}
          {controller.vidLabel.singular} you wish to retrieve
        </Text>
        <Column>
          <Input
            placeholder={!controller.uin ? inputLabel : ''}
            label={controller.uin ? inputLabel : ''}
            labelStyle={{
              color: controller.isInvalid ? Colors.Red : Colors.Black,
            }}
            value={controller.uin}
            keyboardType="number-pad"
            rightIcon={
              controller.isInvalid ? (
                <Icon name="error" size={18} color="red" />
              ) : null
            }
            errorStyle={{ color: Colors.Red }}
            errorMessage={controller.uinError}
            onChangeText={controller.INPUT_UIN}
            ref={(node) => !controller.uinInputRef && controller.READY(node)}
          />
          <Button
            title={`Generate ${controller.vidLabel.singular}`}
            margin="24 0 0 0"
            onPress={controller.VALIDATE_UIN}
            loading={controller.isRequestingOtp}
          />
        </Column>
      </Column>
    </Modal>
  );
};
