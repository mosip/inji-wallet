import { useSelector } from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import { ModalProps } from '../../components/ui/Modal';
import {
  selectIsEditingTag,
  selectVc,
  VcItemEvents,
  vcItemMachine,
} from '../../machines/vcItem';

export function useViewVcModal({ vcItemActor }: ViewVcModalProps) {
  return {
    vc: useSelector(vcItemActor, selectVc),

    isEditingTag: useSelector(vcItemActor, selectIsEditingTag),

    EDIT_TAG: () => vcItemActor.send(VcItemEvents.EDIT_TAG()),
    SAVE_TAG: (tag: string) => vcItemActor.send(VcItemEvents.SAVE_TAG(tag)),
    DISMISS: () => vcItemActor.send(VcItemEvents.DISMISS()),
  };
}

export interface ViewVcModalProps extends ModalProps {
  vcItemActor: ActorRefFrom<typeof vcItemMachine>;
}
