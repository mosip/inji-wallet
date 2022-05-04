import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-elements';
import { MessageOverlay } from '../components/MessageOverlay';
import { Button, Centered, Column, Text } from '../components/ui';
import { Colors } from '../components/ui/styleUtils';
import { RootRouteProps } from '../routes';
import { useAuthScreen } from './AuthScreenController';

export const AuthScreen: React.FC<RootRouteProps> = (props) => {
  const { t } = useTranslation('AuthScreen');
  const controller = useAuthScreen(props);

  return (
    <Column fill pY={32} pX={32} backgroundColor={Colors.White}>
      <MessageOverlay
        isVisible={controller.alertMsg != ''}
        onBackdropPress={controller.hideAlert}
        title={controller.alertMsg}
      />
      <Column>
        <Text align="center">{t('header')}</Text>
      </Column>
      <Centered fill>
        <Icon name="fingerprint" size={180} color={Colors.Orange} />
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
