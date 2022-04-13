import React from 'react';
import { Icon } from 'react-native-elements';
import { MAX_PIN, PasscodeVerify } from '../components/PasscodeVerify';
import { PinInput } from '../components/PinInput';
import { Column, Text } from '../components/ui';
import { Colors } from '../components/ui/styleUtils';
import { PasscodeRouteProps } from '../routes';
import { usePasscodeScreen } from './PasscodeScreenController';

export const PasscodeScreen: React.FC<PasscodeRouteProps> = (props) => {
  const controller = usePasscodeScreen(props);

  const passcodeSetup =
    controller.passcode === '' ? (
      <React.Fragment>
        <Text align="center">
          Set a passcode to secure{'\n'}your application
        </Text>
        <PinInput length={MAX_PIN} onDone={controller.setPasscode} />
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Text align="center">Confirm your passcode</Text>
        <PasscodeVerify
          onSuccess={controller.SETUP_PASSCODE}
          onError={controller.setError}
          passcode={controller.passcode}
        />
      </React.Fragment>
    );
    
  return (
    <Column fill padding="32" backgroundColor={Colors.White}>
      <Icon name="lock" color={Colors.Orange} size={60} />
      {props.route.params?.setup ? (
        <Column fill align="space-between" width="100%">
          {passcodeSetup}
        </Column>
      ) : (
        <Column fill align="space-between" width="100%">
          <Text align="center">Enter your passcode</Text>
          <PasscodeVerify
            onSuccess={controller.LOGIN}
            onError={controller.setError}
            passcode={controller.storedPasscode}
          />
        </Column>
      )}

      <Column fill>
        <Text align="center" color={Colors.Red}>
          {controller.error}
        </Text>
      </Column>
    </Column>
  );
};
