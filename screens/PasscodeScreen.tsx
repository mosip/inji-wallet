import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Image} from 'react-native';
import {MAX_PIN, PasscodeVerify} from '../components/PasscodeVerify';
import {PinInput} from '../components/PinInput';
import {Column, Text} from '../components/ui';
import {Theme} from '../components/ui/styleUtils';
import {PasscodeRouteProps} from '../routes';
import {usePasscodeScreen} from './PasscodeScreenController';
import {hashData} from '../shared/commonUtil';
import {argon2iConfig} from '../shared/constants';
import {
  getEndData,
  getErrorData,
  getImpressionData,
  sendEndEvent,
  sendErrorEvent,
  sendImpressionEvent,
} from '../shared/telemetry/TelemetryUtils';
import {BackHandler} from 'react-native';

export const PasscodeScreen: React.FC<PasscodeRouteProps> = props => {
  const {t} = useTranslation('PasscodeScreen');
  const controller = usePasscodeScreen(props);

  const handleBackButtonPress = () => {
    const routes = props.navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2];
    if (props.route.params?.setup) {
      sendErrorEvent(
        getErrorData(
          'App Onboarding',
          'user_cancel',
          'Authentication canceled',
        ),
      );
      sendEndEvent(getEndData('App Onboarding', 'FAILURE'));
    } else {
      sendErrorEvent(
        getErrorData('App Login', 'user_cancel', 'Authentication canceled'),
      );
      sendEndEvent(getEndData('App Login', 'FAILURE'));
    }
    if (routes.length >= 2) {
      sendImpressionEvent(getImpressionData(prevRoute.name));
    }
    return false;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const setPasscode = async (passcode: string) => {
    const data = await hashData(passcode, controller.storedSalt, argon2iConfig);
    controller.setPasscode(data);
  };

  const handlePasscodeMismatch = (error: string) => {
    controller.incrementPasscodeRetryCount();
    controller.setError(error);
  };

  const passcodeSetup =
    controller.passcode === '' ? (
      <React.Fragment>
        <Column>
          <Text
            testID="setPasscode"
            align="center"
            style={Theme.TextStyles.header}>
            {t('header')}
          </Text>
          <Text
            align="center"
            weight="semibold"
            color={Theme.Colors.GrayText}
            margin="6 0">
            {t('enterNewPassword')}
          </Text>
        </Column>

        <PinInput
          testID="setPasscodePin"
          length={MAX_PIN}
          onDone={setPasscode}
        />
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Column>
          <Text
            testID="confirmPasscode"
            align="center"
            style={Theme.TextStyles.header}>
            {t('confirmPasscode')}
          </Text>
          <Text
            align="center"
            weight="semibold"
            color={Theme.Colors.GrayText}
            margin="6 0">
            {t('reEnterPassword')}
          </Text>
        </Column>
        <PasscodeVerify
          onSuccess={controller.SETUP_PASSCODE}
          onError={handlePasscodeMismatch}
          passcode={controller.passcode}
          salt={controller.storedSalt}
        />
      </React.Fragment>
    );

  return (
    <Column
      fill
      padding="32"
      backgroundColor={Theme.Colors.whiteBackgroundColor}>
      <Image source={Theme.LockIcon} style={{alignSelf: 'center'}} />
      {props.route.params?.setup ? (
        <Column fill align="space-around" width="100%">
          {passcodeSetup}
        </Column>
      ) : (
        <Column fill align="space-around" width="100%">
          <Text
            testID="enterPasscode"
            align="center"
            weight="semibold"
            color={Theme.Colors.GrayText}
            margin="6 0">
            {t('enterPasscode')}
          </Text>
          <PasscodeVerify
            onSuccess={controller.LOGIN}
            onError={handlePasscodeMismatch}
            passcode={controller.storedPasscode}
            salt={controller.storedSalt}
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
