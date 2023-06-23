import React from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../components/Logo';
import { Button, HorizontallyCentered, Column } from '../components/ui';
import { Theme } from '../components/ui/styleUtils';
import { RootRouteProps } from '../routes';
import { useWelcomeScreen } from './WelcomeScreenController';

export const WelcomeScreen: React.FC<RootRouteProps> = (props) => {
  const { t } = useTranslation('WelcomeScreen');
  const controller = useWelcomeScreen(props);

  return (
    <Column
      fill
      padding="32 32 0"
      backgroundColor={Theme.Colors.whiteBackgroundColor}>
      <HorizontallyCentered fill>
        <Logo height={182} />
      </HorizontallyCentered>
      <Button
        margin="0 0 32"
        title={controller.isSettingUp ? t('getStarted') : t('unlockApp')}
        onPress={controller.unlockPage}
      />
    </Column>
  );
};
