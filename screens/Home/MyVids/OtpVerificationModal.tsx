import React from 'react';
import { Icon } from 'react-native-elements';
import { PinInput } from '../../../components/PinInput';
import { Column, Text } from '../../../components/ui';
import { Modal, ModalProps } from '../../../components/ui/Modal';
import { Colors } from '../../../components/ui/styleUtils';

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = (
  props
) => {
  return (
    <Modal isVisible={props.isVisible} onDismiss={props.onDismiss}>
      <Column fill padding="32">
        <Icon name="lock" color={Colors.Orange} size={60} />
        <Column fill align="space-between">
          <Text align="center">
            Enter the 6-digit verification code we sent you
          </Text>
          <Text align="center" color={Colors.Red} margin="16 0 0 0">
            {props.error}
          </Text>
          <PinInput length={6} onDone={props.onInputDone} />
        </Column>
        <Column fill></Column>
      </Column>
    </Modal>
  );
};

interface OtpVerificationModalProps extends ModalProps {
  onInputDone: (otp: string) => void;
  error?: string;
}
