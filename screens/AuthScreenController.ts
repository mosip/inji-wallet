import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectSettingUp } from '../machines/auth';
import { RootRouteProps } from '../routes';
import { GlobalContext } from '../shared/GlobalContext';

export function useAuthScreen(props: RootRouteProps) {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');

  const isSettingUp = useSelector(authService, selectSettingUp);

  return {
    isSettingUp,

    usePasscode: () => {
      props.navigation.navigate('Passcode', { setup: isSettingUp });
    },
  };
}
