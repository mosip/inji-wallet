import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-elements';
import { MessageOverlay } from '../components/MessageOverlay';
import { Button, Centered, Column, Text } from '../components/ui';
import { Theme } from '../components/ui/styleUtils';
import { RootRouteProps } from '../routes';
import { useAuthScreen } from './AuthScreenController';

export const AuthScreen: React.FC<RootRouteProps> = (props) => {
  const { t } = useTranslation('AuthScreen');
  const controller = useAuthScreen(props);

  return (
    <Column fill padding={[32, 32, 32, 32]} backgroundColor={Theme.Colors.whiteBackgroundColor}>
      <MessageOverlay
        isVisible={controller.alertMsg != ''}
        onBackdropPress={controller.hideAlert}
        title={controller.alertMsg}
      />
      <Column>
        <Text align="center">{t('header')}</Text>
      </Column>
      <Centered fill>
        <Icon name="fingerprint" size={180} color={Theme.Colors.Icon} />
      </Centered>
      <Column>
        <Button
          title={t('useBiometrics')}
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
