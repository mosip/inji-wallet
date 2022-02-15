import { useSelector } from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import { ModalProps } from '../../components/ui/Modal';
import {
  selectIsEditingTag,
  selectVid,
  VidItemEvents,
  vidItemMachine,
} from '../../machines/vidItem';

export function useViewVidModal({ vidItemActor }: ViewVidModalProps) {
  return {
    vid: useSelector(vidItemActor, selectVid),

    isEditingTag: useSelector(vidItemActor, selectIsEditingTag),

    EDIT_TAG: () => vidItemActor.send(VidItemEvents.EDIT_TAG()),
    SAVE_TAG: (tag: string) => vidItemActor.send(VidItemEvents.SAVE_TAG(tag)),
    DISMISS: () => vidItemActor.send(VidItemEvents.DISMISS()),
  };
}

export interface ViewVidModalProps extends ModalProps {
  vidItemActor: ActorRefFrom<typeof vidItemMachine>;
}
