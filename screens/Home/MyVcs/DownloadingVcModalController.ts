import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectVcLabel } from '../../../machines/settings';
import { GlobalContext } from '../../../shared/GlobalContext';

export function useDownloadingVcModal() {
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');

  return {
    vcLabel: useSelector(settingsService, selectVcLabel),
  };
}
