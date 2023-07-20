import { useContext } from 'react';
import { GlobalContext } from '../shared/GlobalContext';
import { StoreEvents } from '../machines/store';

export function useApp() {
  const { appService } = useContext(GlobalContext);
  const storeService = appService.children.get('store');
  const appSvc = appService.children.get('app');
  return {
    ignoreDecrypt: () => appSvc.send('READY'),
    IGNORE: () => storeService.send(StoreEvents.IGNORE()),
    TRY_AGAIN: () => storeService.send(StoreEvents.TRY_AGAIN()),
  };
}
