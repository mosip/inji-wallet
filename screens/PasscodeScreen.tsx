import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-elements';
import { MAX_PIN, PasscodeVerify } from '../components/PasscodeVerify';
import { PinInput } from '../components/PinInput';
import { Column, Text } from '../components/ui';
import { Theme } from '../components/ui/styleUtils';
import { PasscodeRouteProps } from '../routes';
import { usePasscodeScreen } from './PasscodeScreenController';

export const PasscodeScreen: React.FC<PasscodeRouteProps> = (props) => {
  const { t } = useTranslation('PasscodeScreen');
  const controller = usePasscodeScreen(props);

  const passcodeSetup =
    controller.passcode === '' ? (
      <React.Fragment>
        <Text align="center">{t('header')}</Text>
        <PinInput length={MAX_PIN} onDone={controller.setPasscode} />
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Text align="center">{t('confirmPasscode')}</Text>
        <PasscodeVerify
          onSuccess={controller.SETUP_PASSCODE}
          onError={controller.setError}
          passcode={controller.passcode}
        />
      </React.Fragment>
    );

  return (
    <Column fill padding="32" backgroundColor={Theme.Colors.White}>
      <Icon name="lock" color={Theme.Colors.Icon} size={60} />
      {props.route.params?.setup ? (
        <Column fill align="space-between" width="100%">
          {passcodeSetup}
        </Column>
      ) : (
        <Column fill align="space-between" width="100%">
          <Text align="center">{t('enterPasscode')}</Text>
          <PasscodeVerify
            onSuccess={controller.LOGIN}
            onError={controller.setError}
            passcode={controller.storedPasscode}
          />
        </Column>
      )}

      <Column fill>
        <Text align="center" color={Theme.Colors.Red}>
          {controller.error}
        </Text>
      </Column>
    </Column>
  );
};
