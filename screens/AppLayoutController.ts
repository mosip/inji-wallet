import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectAuthorized } from '../machines/auth';
import { GlobalContext } from '../shared/GlobalContext';

export function useAppLayout() {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');

  return {
    isAuthorized: useSelector(authService, selectAuthorized),
  };
}
