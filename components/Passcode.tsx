import React from 'react';
import { Dimensions, Modal as RNModal, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { PasscodeVerify } from '../components/PasscodeVerify';
import { Column, Text } from '../components/ui';
import { Colors } from '../components/ui/styleUtils';

const styles = StyleSheet.create({
  modal: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
});

export const Passcode: React.FC<PasscodeProps> = (props) => {
  return (
    <RNModal
      animationType="slide"
      style={styles.modal}
      visible={true}
      onRequestClose={props.onDismiss}>
      <Column fill padding="32" backgroundColor={Colors.White}>
        <Icon name="lock" color={Colors.Orange} size={60} />
        <Column fill align="space-between" width="100%">
          <Text align="center">{props.message || 'Enter your passcode'}</Text>
          <PasscodeVerify
            onSuccess={props.onSuccess}
            onError={props.onError}
            passcode={props.storedPasscode}
          />
        </Column>
        <Column fill>
          <Text align="center" color={Colors.Red}>
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
