import { EventFrom, StateFrom } from 'xstate';
import { send, sendParent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { StoreEvents } from './store';
import { VID } from '../types/vid';
import { AppServices } from '../shared/GlobalContext';
import { log, respond } from 'xstate/lib/actions';
import { VidItemEvents } from './vidItem';
import {
  MY_VIDS_STORE_KEY,
  RECEIVED_VIDS_STORE_KEY,
  VID_ITEM_STORE_KEY,
} from '../shared/storeKeys';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    myVids: [] as string[],
    receivedVids: [] as string[],
    vids: {} as Record<string, VID>,
  },
  {
    events: {
      VIEW_VID: (vid: VID) => ({ vid }),
      GET_VID_ITEM: (vidKey: string) => ({ vidKey }),
      STORE_RESPONSE: (response: any) => ({ response }),
      STORE_ERROR: (error: Error) => ({ error }),
      VID_ADDED: (vidKey: string) => ({ vidKey }),
      VID_RECEIVED: (vidKey: string) => ({ vidKey }),
      VID_DOWNLOADED: (vid: VID) => ({ vid }),
      REFRESH_MY_VIDS: () => ({}),
      REFRESH_RECEIVED_VIDS: () => ({}),
      GET_RECEIVED_VIDS: () => ({}),
    },
  }
);

export const VidEvents = model.events;

type GetVidItemEvent = EventFrom<typeof model, 'GET_VID_ITEM'>;
type StoreResponseEvent = EventFrom<typeof model, 'STORE_RESPONSE'>;
type VidDownloadedEvent = EventFrom<typeof model, 'VID_DOWNLOADED'>;
type VidAddedEvent = EventFrom<typeof model, 'VID_ADDED'>;
type VidReceivedEvent = EventFrom<typeof model, 'VID_RECEIVED'>;

export const vidMachine = model.createMachine(
  {
    id: 'vid',
    context: model.initialContext,
    initial: 'init',
    states: {
      init: {
        initial: 'myVids',
        states: {
          myVids: {
            entry: ['loadMyVids'],
            on: {
              STORE_RESPONSE: {
                target: 'receivedVids',
                actions: ['setMyVids'],
              },
            },
          },
          receivedVids: {
            entry: ['loadReceivedVids'],
            on: {
              STORE_RESPONSE: {
                target: '#ready',
                actions: ['setReceivedVids'],
              },
            },
          },
        },
      },
      ready: {
        id: 'ready',
        entry: [sendParent('READY')],
        on: {
          GET_RECEIVED_VIDS: {
            actions: ['getReceivedVidsResponse'],
          },
          GET_VID_ITEM: {
            actions: ['getVidItemResponse'],
          },
          VID_ADDED: {
            actions: ['prependToMyVids'],
          },
          VID_DOWNLOADED: {
            actions: ['setDownloadedVid'],
          },
          VID_RECEIVED: {
            actions: ['prependToReceivedVids'],
          },
        },
        type: 'parallel',
        states: {
          myVids: {
            initial: 'idle',
            states: {
              idle: {
                on: {
                  REFRESH_MY_VIDS: 'refreshing',
                },
              },
              refreshing: {
                entry: ['loadMyVids'],
                on: {
                  STORE_RESPONSE: {
                    target: 'idle',
                    actions: ['setMyVids'],
                  },
                },
              },
            },
          },
          receivedVids: {
            initial: 'idle',
            states: {
              idle: {
                on: {
                  REFRESH_RECEIVED_VIDS: 'refreshing',
                },
              },
              refreshing: {
                entry: ['loadReceivedVids'],
                on: {
                  STORE_RESPONSE: {
                    target: 'idle',
                    actions: ['setReceivedVids'],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      getReceivedVidsResponse: respond((context) => ({
        type: 'VID_RESPONSE',
        response: context.receivedVids,
      })),

      getVidItemResponse: respond((context, event: GetVidItemEvent) => {
        const vid = context.vids[event.vidKey];
        return VidItemEvents.GET_VID_RESPONSE(vid);
      }),

      loadMyVids: send(StoreEvents.GET(MY_VIDS_STORE_KEY), {
        to: (context) => context.serviceRefs.store,
      }),

      loadReceivedVids: send(StoreEvents.GET(RECEIVED_VIDS_STORE_KEY), {
        to: (context) => context.serviceRefs.store,
      }),

      setMyVids: model.assign({
        myVids: (_, event: StoreResponseEvent) => event.response || [],
      }),

      setReceivedVids: model.assign({
        receivedVids: (_, event: StoreResponseEvent) => event.response || [],
      }),

      setDownloadedVid: (context, event: VidDownloadedEvent) => {
        context.vids[VID_ITEM_STORE_KEY(event.vid.uin, event.vid.requestId)] =
          event.vid;
      },

      prependToMyVids: model.assign({
        myVids: (context, event: VidAddedEvent) => [
          event.vidKey,
          ...context.myVids,
        ],
      }),

      prependToReceivedVids: model.assign({
        receivedVids: (context, event: VidReceivedEvent) => [
          event.vidKey,
          ...context.receivedVids,
        ],
      }),
    },
  }
);

export function createVidMachine(serviceRefs: AppServices) {
  return vidMachine.withContext({
    ...vidMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof vidMachine>;

export function selectMyVids(state: State) {
  return state.context.myVids;
}

export function selectReceivedVids(state: State) {
  return state.context.receivedVids;
}

export function selectIsRefreshingMyVids(state: State) {
  return state.matches('ready.myVids.refreshing');
}

export function selectIsRefreshingReceivedVids(state: State) {
  return state.matches('ready.receivedVids.refreshing');
}
