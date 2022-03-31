import { EventFrom, StateFrom, send, sendParent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { StoreEvents } from './store';
import { VC } from '../types/vc';
import { AppServices } from '../shared/GlobalContext';
import { respond } from 'xstate/lib/actions';
import { VidItemEvents } from './vidItem';
import {
  MY_VIDS_STORE_KEY,
  RECEIVED_VIDS_STORE_KEY,
  VID_ITEM_STORE_KEY,
} from '../shared/constants';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    myVids: [] as string[],
    receivedVids: [] as string[],
    vids: {} as Record<string, VC>,
  },
  {
    events: {
      VIEW_VID: (vid: VC) => ({ vid }),
      GET_VID_ITEM: (vidKey: string) => ({ vidKey }),
      STORE_RESPONSE: (response: unknown) => ({ response }),
      STORE_ERROR: (error: Error) => ({ error }),
      VID_ADDED: (vidKey: string) => ({ vidKey }),
      VID_RECEIVED: (vidKey: string) => ({ vidKey }),
      VID_DOWNLOADED: (vid: VC) => ({ vid }),
      REFRESH_MY_VIDS: () => ({}),
      REFRESH_RECEIVED_VIDS: () => ({}),
      GET_RECEIVED_VIDS: () => ({}),
    },
  }
);

export const VidEvents = model.events;

export const vidMachine = model.createMachine(
  {
    tsTypes: {} as import('./vid.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'vid',
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

      getVidItemResponse: respond((context, event) => {
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
        myVids: (_, event) => (event.response || []) as string[],
      }),

      setReceivedVids: model.assign({
        receivedVids: (_, event) => (event.response || []) as string[],
      }),

      setDownloadedVid: (context, event) => {
        context.vids[VID_ITEM_STORE_KEY(event.vid)] = event.vid;
      },

      prependToMyVids: model.assign({
        myVids: (context, event) => [event.vidKey, ...context.myVids],
      }),

      prependToReceivedVids: model.assign({
        receivedVids: (context, event) => [
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

export function selectShareableVids(state: State) {
  return state.context.myVids.filter(
    (vidKey) => state.context.vids[vidKey]?.credential != null
  );
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
