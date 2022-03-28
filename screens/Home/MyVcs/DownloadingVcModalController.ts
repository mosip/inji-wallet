import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectVCLabel } from '../../../machines/settings';
import { GlobalContext } from '../../../shared/GlobalContext';

export function useDownloadingvcModal() {
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');

  return {
    VCLabel: useSelector(settingsService, selectVCLabel),
  };
}
