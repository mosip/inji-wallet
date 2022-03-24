import { ActorRefFrom } from 'xstate';
import { vidItemMachine } from '../machines/vidItem';

export const VidTabEvents = {
  VIEW_VID: (vidItemActor: ActorRefFrom<typeof vidItemMachine>) => ({
    vidItemActor,
  }),
  REFRESH: () => ({}),
};

export const StoreEvents = {
  STORE_RESPONSE: (response: any) => ({ response }),
  STORE_ERROR: (error: Error) => ({ error }),
};

export const ModalEvents = {
  DISMISS: () => ({}),
};

export const GenericEvents = {
  ERROR: (error: Error) => ({ error }),
};
