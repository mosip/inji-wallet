import React from 'react';
import {useTranslation} from 'react-i18next';
import {Logo} from '../components/Logo';
import {Button, HorizontallyCentered, Column} from '../components/ui';
import {Theme} from '../components/ui/styleUtils';
import {RootRouteProps} from '../routes';
import {useWelcomeScreen} from './WelcomeScreenController';
import {SvgImage} from '../components/ui/svg';

export const WelcomeScreen: React.FC<RootRouteProps> = props => {
  const {t} = useTranslation('WelcomeScreen');
  const controller = useWelcomeScreen(props);
  return (
    <Column
      fill
      padding="32 32 0"
      backgroundColor={Theme.Colors.whiteBackgroundColor}>
      <HorizontallyCentered fill>
        {SvgImage.InjiLogo(Theme.Styles.welcomeLogo)}
      </HorizontallyCentered>
      <Button
        testID="unlockApplication"
        margin="0 0 32"
        type='gradient'
        title={t('unlockApplication')}
        onPress={controller.unlockPage}
      />
    </Column>
  );
};
