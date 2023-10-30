import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {Button, Centered, Column} from '../components/ui';
import {Theme} from '../components/ui/styleUtils';
import {RootRouteProps} from '../routes';
import {useBiometricScreen} from './BiometricScreenController';
import {Passcode} from '../components/Passcode';
import {
  TelemetryConstants,
  getEventType,
  incrementRetryCount,
  resetRetryCount,
} from '../shared/telemetry/TelemetryUtils';

export const BiometricScreen: React.FC<RootRouteProps> = props => {
  const {t} = useTranslation('BiometricScreen');
  const controller = useBiometricScreen(props);

  const handlePasscodeMismatch = (error: string) => {
    incrementRetryCount(
      getEventType(props.route.params?.setup),
      TelemetryConstants.Screens.passcode,
    );
    controller.onError(error);
  };

  const handleOnSuccess = () => {
    resetRetryCount();
    controller.onSuccess();
  };

  return (
    <Column
      fill
      pY={32}
      pX={32}
      backgroundColor={Theme.Colors.whiteBackgroundColor}>
      <Centered fill>
        <TouchableOpacity onPress={controller.useBiometrics}>
          <Icon name="fingerprint" size={180} color={Theme.Colors.Icon} />
        </TouchableOpacity>
      </Centered>

      <Button
        title={t('unlock')}
        margin="8 0"
        onPress={controller.useBiometrics}
        disabled={controller.isSuccessBio}
      />
      {controller.isReEnabling && (
        <Passcode
          message="Enter your passcode to re-enable biometrics authentication."
          onSuccess={handleOnSuccess}
          onError={handlePasscodeMismatch}
          storedPasscode={controller.storedPasscode}
          onDismiss={() => controller.onDismiss()}
          error={controller.error}
          salt={controller.passcodeSalt}
        />
      )}
    </Column>
  );
};
