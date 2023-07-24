import { useContext } from 'react';
import { GlobalContext } from '../shared/GlobalContext';
import { StoreEvents } from '../machines/store';

export function useApp() {
  const { appService } = useContext(GlobalContext);
  const storeService = appService.children.get('store');
  return {
    ignoreDecrypt: () => appService.send('DECRYPT_ERROR_DISMISS'),
    IGNORE: () => storeService.send(StoreEvents.IGNORE()),
    TRY_AGAIN: () => storeService.send(StoreEvents.TRY_AGAIN()),
  };
}
