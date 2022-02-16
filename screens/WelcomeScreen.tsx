import React from 'react';
import { Logo } from '../components/Logo';
import { Button, Centered, Column, Text } from '../components/ui';
import { Colors } from '../components/ui/styleUtils';
import { RootRouteProps } from '../routes';
import { useWelcomeScreen } from './WelcomeScreenController';

export const WelcomeScreen: React.FC<RootRouteProps> = (props) => {
  const controller = useWelcomeScreen(props);

  return (
    <Column fill padding="32" backgroundColor={Colors.White}>
      <Centered fill>
        <Logo height={182} />
        <Text margin="16 0 0 0">Open Source Identity Solution</Text>
      </Centered>
      <Button
        title={controller.isSettingUp ? 'Get started' : 'Unlock application'}
        onPress={controller.unlockPage}
      />
    </Column>
  );
};
