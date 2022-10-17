import { useContext } from 'react';
import { scanMachine, selectSelectedVc } from '../../machines/scan';
import { GlobalContext } from '../../shared/GlobalContext';

import { useSelector } from '@xstate/react';

export function useVerifyIdentityOverlay() {
  const { appService } = useContext(GlobalContext);
  const scanService = appService.children.get(scanMachine.id);

  return {
    selectedVc: useSelector(scanService, selectSelectedVc),
  };
}

export interface VerifyIdentityOverlayProps {
  isVisible: boolean;
  onCancel: () => void;
  onFaceValid: () => void;
  onFaceInvalid: () => void;
}
