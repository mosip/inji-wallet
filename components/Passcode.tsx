import React, {useEffect} from 'react';
import {Modal as RNModal} from 'react-native';
import {Icon} from 'react-native-elements';
import {PasscodeVerify} from '../components/PasscodeVerify';
import {Column, Text} from '../components/ui';
import {Theme} from '../components/ui/styleUtils';
import {
  TelemetryConstants,
  getImpressionEventData,
  sendImpressionEvent,
} from '../shared/telemetry/TelemetryUtils';

export const Passcode: React.FC<PasscodeProps> = props => {
  useEffect(() => {
    sendImpressionEvent(
      getImpressionEventData(
        TelemetryConstants.FlowType.appLogin,
        TelemetryConstants.Screens.passcode,
      ),
    );
  }, []);

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
            salt={props.salt}
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
  salt: string;
  onSuccess: () => void;
  onError: (value: string) => void;
  onDismiss: () => void;
}
