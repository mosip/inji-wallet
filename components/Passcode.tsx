import React from 'react';
import { Modal as RNModal } from 'react-native';
import { Icon } from 'react-native-elements';
import { PasscodeVerify } from '../components/PasscodeVerify';
import { Column, Text } from '../components/ui';
import { Theme } from '../components/ui/styleUtils';

export const Passcode: React.FC<PasscodeProps> = (props) => {
  return (
    <RNModal
      animationType="slide"
      style={Theme.PasscodeStyles.modal}
      visible={true}
      onRequestClose={props.onDismiss}>
      <Column
        fill
        padding="32"
        backgroundColor={Theme.Colors.whiteBackgroundColor}>
        <Icon name="lock" color={Theme.Colors.Icon} size={60} />
        <Column fill align="space-between" width="100%">
          <Text align="center">{props.message || 'Enter your passcode'}</Text>
          <PasscodeVerify
            onSuccess={props.onSuccess}
            onError={props.onError}
            passcode={props.storedPasscode}
          />
        </Column>
        <Column fill>
          <Text align="center" color={Theme.Colors.errorMessage}>
            {props.error}
          </Text>
        </Column>
      </Column>
    </RNModal>
  );
};

interface PasscodeProps {
  message?: string;
  error: string;
  storedPasscode: string;
  onSuccess: () => void;
  onError: (value: string) => void;
  onDismiss: () => void;
}
