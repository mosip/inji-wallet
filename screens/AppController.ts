import { useContext } from 'react';
import { GlobalContext } from '../shared/GlobalContext';
import { StoreEvents } from '../machines/store';
import { APP_EVENTS } from '../machines/app';

export function useApp() {
  const { appService } = useContext(GlobalContext);
  const storeService = appService.children.get('store');
  return {
    ignoreDecrypt: () => appService.send('DECRYPT_ERROR_DISMISS'),
    IGNORE: () => storeService.send(StoreEvents.IGNORE()),
    TRY_AGAIN: () => storeService.send(StoreEvents.TRY_AGAIN()),
    RESET: () =>
      appService.send(APP_EVENTS.RESET_KEY_INVALIDATE_ERROR_DISMISS()),
  };
}
