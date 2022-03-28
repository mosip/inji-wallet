import { useSelector } from '@xstate/react';
import { useContext, useState } from 'react';
import { ActorRefFrom } from 'xstate';
import { selectVcLabel } from '../../machines/settings';
import { vcItemMachine } from '../../machines/vcItem';
import { GlobalContext } from '../../shared/GlobalContext';
import { VC } from '../../types/vc';

export function useSelectVcOverlay(props: SelectVcOverlayProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const [selectedVcRef, setSelectedVcRef] =
    useState<ActorRefFrom<typeof vcItemMachine>>(null);

  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');

  return {
    selectVcItem,
    selectedIndex,
    vcLabel: useSelector(settingsService, selectVcLabel),

    onSelect: () => {
      const { serviceRefs, ...vc } = selectedVcRef.getSnapshot().context;
      props.onSelect(vc);
    },
  };

  function selectVcItem(index: number) {
    return (vcRef: ActorRefFrom<typeof vcItemMachine>) => {
      setSelectedIndex(index);
      setSelectedVcRef(vcRef);
    };
  }
}

export interface SelectVcOverlayProps {
  isVisible: boolean;
  receiverName: string;
  vcKeys: string[];
  onSelect: (vc: VC) => void;
  onCancel: () => void;
}
