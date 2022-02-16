import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectPasscode, selectSettingUp } from '../machines/auth';
import { RootRouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';

export function useWelcomeScreen(props: RootRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');

  const isSettingUp = useSelector(authService, selectSettingUp);
  const passcode = useSelector(authService, selectPasscode);

  return {
    isSettingUp,

    unlockPage: () => {
      if (!isSettingUp && passcode !== '') {
        props.navigation.navigate('Passcode', { setup: isSettingUp });
      } else {
        props.navigation.navigate('Auth');
      }
    },
  };
}
