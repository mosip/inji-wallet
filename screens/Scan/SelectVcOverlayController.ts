import { useState } from 'react';
import { ActorRefFrom } from 'xstate';
import { vcItemMachine } from '../../machines/vcItem';
import { VC } from '../../types/vc';

export function useSelectVcOverlay(props: SelectVcOverlayProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const [selectedVcRef, setSelectedVcRef] =
    useState<ActorRefFrom<typeof vcItemMachine>>(null);

  return {
    selectVcItem,
    selectedIndex,

    onSelect: () => {
      const { serviceRefs, ...vc } = selectedVcRef.getSnapshot().context;
      props.onSelect(vc);
    },

    onVerifyAndSelect: () => {
      const { serviceRefs, ...vc } = selectedVcRef.getSnapshot().context;
      props.onVerifyAndSelect(vc);
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
  onVerifyAndSelect: (vc: VC) => void;
  onCancel: () => void;
}
