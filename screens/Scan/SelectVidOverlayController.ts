import { useSelector } from '@xstate/react';
import { useContext, useState } from 'react';
import { ActorRefFrom } from 'xstate';
import { selectVidLabel } from '../../machines/settings';
import { vidItemMachine } from '../../machines/vidItem';
import { GlobalContext } from '../../shared/GlobalContext';
import { VC } from '../../types/vc';

export function useSelectVidOverlay(props: SelectVidOverlayProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const [selectedVidRef, setSelectedVidRef] =
    useState<ActorRefFrom<typeof vidItemMachine>>(null);

  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');

  return {
    selectVidItem,
    selectedIndex,
    vidLabel: useSelector(settingsService, selectVidLabel),

    onSelect: () => {
      const { serviceRefs, ...vid } = selectedVidRef.getSnapshot().context;
      props.onSelect(vid);
    },
  };

  function selectVidItem(index: number) {
    return (vidRef: ActorRefFrom<typeof vidItemMachine>) => {
      setSelectedIndex(index);
      setSelectedVidRef(vidRef);
    };
  }
}

export interface SelectVidOverlayProps {
  isVisible: boolean;
  receiverName: string;
  vidKeys: string[];
  onSelect: (vid: VC) => void;
  onCancel: () => void;
}
