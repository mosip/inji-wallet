import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-elements';
import { Image } from 'react-native';
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
        <Column>
          <Text align="center" style={Theme.TextStyles.header}>
            {t('header')}
          </Text>
          <Text align="center" weight="semibold" color={Theme.Colors.GrayText}>
            {t('description')}
          </Text>
        </Column>

        <PinInput length={MAX_PIN} onDone={controller.setPasscode} />
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Column>
          <Text align="center" style={Theme.TextStyles.header}>
            {t('confirmPasscode')}
          </Text>
          <Text align="center" weight="semibold" color={Theme.Colors.GrayText}>
            {t('description')}
          </Text>
        </Column>
        <PasscodeVerify
          onSuccess={controller.SETUP_PASSCODE}
          onError={controller.setError}
          passcode={controller.passcode}
        />
      </React.Fragment>
    );

  return (
    <Column
      fill
      padding="32"
      backgroundColor={Theme.Colors.whiteBackgroundColor}>
      <Image source={Theme.LockIcon} style={{ alignSelf: 'center' }} />
      {props.route.params?.setup ? (
        <Column fill align="space-around" width="100%">
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
        <Text align="center" color={Theme.Colors.errorMessage}>
          {controller.error}
        </Text>
      </Column>
    </Column>
  );
};
