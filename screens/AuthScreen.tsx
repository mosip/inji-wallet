import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-elements';
import { MessageOverlay } from '../components/MessageOverlay';
import { Button, Column, Text } from '../components/ui';
import { Theme } from '../components/ui/styleUtils';
import { RootRouteProps } from '../routes';
import { useAuthScreen } from './AuthScreenController';

export const AuthScreen: React.FC<RootRouteProps> = (props) => {
  const { t } = useTranslation('AuthScreen');
  const controller = useAuthScreen(props);

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
        <Column margin="20 0 0 0">
          <Text weight="semibold" align="center">
            {t('header')}
          </Text>
          <Text align="center" color={Theme.Colors.GrayText}>
            {t('Description')}
          </Text>
        </Column>
      </Column>

      <Column>
        <Button
          title={t('useBiometrics')}
          type="radius"
          margin="0 0 8 0"
          disabled={!controller.isBiometricsAvailable}
          onPress={controller.useBiometrics}
        />
        <Button
          type="clear"
          title={t('usePasscode')}
          onPress={controller.usePasscode}
        />
      </Column>
    </Column>
  );
};
