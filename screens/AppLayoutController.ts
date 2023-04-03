import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import {
  selectAuthorized,
  selectLanguagesetup,
  selectIntroSlider,
  selectUnauthorized,
} from '../machines/auth';
import { GlobalContext } from '../shared/GlobalContext';

export function useAppLayout() {
  const { appService } = useContext(GlobalContext);
  const authService = appService.children.get('auth');
  const isLanguagesetup = useSelector(authService, selectLanguagesetup);
  return {
    isAuthorized: useSelector(authService, selectAuthorized),
    isUnAuthorized: useSelector(authService, selectUnauthorized),
    isLanguagesetup,
  };
}
