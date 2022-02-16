import {
  ActorRefFrom,
  EventFrom,
  sendParent,
  spawn,
  send,
  StateFrom,
} from 'xstate';
import { log } from 'xstate/lib/actions';
import { createModel } from 'xstate/lib/model';
import { createVidItemMachine, vidItemMachine } from '../../machines/vidItem';
import { AppServices } from '../../shared/GlobalContext';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    error: '',
  },
  {
    events: {
      VIEW_VID: (vidItemActor: ActorRefFrom<typeof vidItemMachine>) => ({
        vidItemActor,
      }),
      REFRESH: () => ({}),
      DISMISS: () => ({}),
      STORE_RESPONSE: (response?: any) => ({ response }),
      STORE_ERROR: (error: Error) => ({ error }),
      ERROR: (error: Error) => ({ error }),
      GET_RECEIVED_VIDS_RESPONSE: (vidKeys: string[]) => ({ vidKeys }),
    },
  }
);

export const ReceivedVidsTabEvents = model.events;

type ErrorEvent = EventFrom<typeof model, 'ERROR'>;
type ViewVidEvent = EventFrom<typeof model, 'VIEW_VID'>;
type GetReceivedVidListResponseEvent = EventFrom<
  typeof model,
  'GET_RECEIVED_VIDS_RESPONSE'
>;

export const ReceivedVidsTabMachine = model.createMachine(
  {
    id: 'ReceivedVidsTab',
    context: model.initialContext,
    initial: 'idle',
    states: {
      idle: {
        on: {
          VIEW_VID: 'viewingVid',
        },
      },
      viewingVid: {
        entry: [
          sendParent((_, event: ViewVidEvent) =>
            model.events.VIEW_VID(event.vidItemActor)
          ),
        ],
        on: {
          DISMISS: 'idle',
        },
      },
    },
  },
  {
    actions: {},
  }
);

export function createReceivedVidsTabMachine(serviceRefs: AppServices) {
  return ReceivedVidsTabMachine.withContext({
    ...ReceivedVidsTabMachine.context,
    serviceRefs,
  });
}
