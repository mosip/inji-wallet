import { ActorRefFrom } from 'xstate';
import { vcItemMachine } from '../machines/vcItem';

export const VcTabEvents = {
  VIEW_VC: (vcItemActor: ActorRefFrom<typeof  vcItemMachine>) => ({
    vcItemActor,
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
