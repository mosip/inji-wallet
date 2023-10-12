import React from 'react';
import {useTranslation} from 'react-i18next';
import {Icon} from 'react-native-elements';
import {MessageOverlay} from '../components/MessageOverlay';
import {Button, Column, Text} from '../components/ui';
import {Theme} from '../components/ui/styleUtils';
import {RootRouteProps} from '../routes';
import {useAuthScreen} from './AuthScreenController';
import {
  getStartEventData,
  getInteractEventData,
  sendInteractEvent,
  sendStartEvent,
} from '../shared/telemetry/TelemetryUtils';

export const AuthScreen: React.FC<RootRouteProps> = props => {
  const {t} = useTranslation('AuthScreen');
  const controller = useAuthScreen(props);

  const handleUsePasscodeButtonPress = () => {
    sendStartEvent(getStartEventData('App Onboarding'));
    sendInteractEvent(
      getInteractEventData('App Onboarding', 'TOUCH', 'Use Passcode Button'),
    );
    controller.usePasscode();
  };
  return (
    <Column
      fill
      padding={[32, 32, 32, 32]}
      backgroundColor={Theme.Colors.whiteBackgroundColor}
      align="space-between">
      <MessageOverlay
        isVisible={controller.alertMsg != ''}
        onBackdropPress={controller.hideAlert}
        title={controller.alertMsg}
      />
      <Column>
        <Icon name="fingerprint" size={80} color={Theme.Colors.Icon} />
        <Column margin="30 0 0 0">
          <Text
            testID="selectAppUnlockMethod"
            align="center"
            style={Theme.TextStyles.header}>
            {t('header')}
          </Text>
          <Text
            align="center"
            weight="semibold"
            color={Theme.Colors.GrayText}
            margin="6 0">
            {t('Description')}
          </Text>
        </Column>
      </Column>

      <Column>
        <Button
          testID="useBiometrics"
          title={t('useBiometrics')}
          type="gradient"
          margin="0 0 8 0"
          disabled={!controller.isBiometricsAvailable}
          onPress={controller.useBiometrics}
        />
        <Button
          testID="usePasscode"
          type="clear"
          title={t('usePasscode')}
          onPress={() => handleUsePasscodeButtonPress()}
        />
      </Column>
    </Column>
  );
};
