import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectVidLabel } from '../../../machines/settings';
import { GlobalContext } from '../../../shared/GlobalContext';

export function useDownloadingvidModal() {
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');

  return {
    vidLabel: useSelector(settingsService, selectVidLabel),
  };
}
