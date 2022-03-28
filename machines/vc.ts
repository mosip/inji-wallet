import { EventFrom, StateFrom } from 'xstate';
import { send, sendParent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { StoreEvents } from './store';
import { VC } from '../types/vc';
import { AppServices } from '../shared/GlobalContext';
import { log, respond } from 'xstate/lib/actions';
import { VcItemEvents } from './vcItem';
import {
  MY_VCS_STORE_KEY,
  RECEIVED_VCS_STORE_KEY,
  VC_ITEM_STORE_KEY,
} from '../shared/constants';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    myVcs: [] as string[],
    receivedVcs: [] as string[],
    vcs: {} as Record<string, VC>,
  },
  {
    events: {
      VIEW_VC: (vc: VC) => ({ vc }),
      GET_VC_ITEM: (vcKey: string) => ({ vcKey }),
      STORE_RESPONSE: (response: any) => ({ response }),
      STORE_ERROR: (error: Error) => ({ error }),
      VC_ADDED: (vcKey: string) => ({ vcKey }),
      VC_RECEIVED: (vcKey: string) => ({ vcKey }),
      VC_DOWNLOADED: (vc: VC) => ({ vc }),
      REFRESH_MY_VCS: () => ({}),
      REFRESH_RECEIVED_VCS: () => ({}),
      GET_RECEIVED_VCS: () => ({}),
    },
  }
);

export const VcEvents = model.events;

type GetVcItemEvent = EventFrom<typeof model, 'GET_VC_ITEM'>;
type StoreResponseEvent = EventFrom<typeof model, 'STORE_RESPONSE'>;
type VcDownloadedEvent = EventFrom<typeof model, 'VC_DOWNLOADED'>;
type VcAddedEvent = EventFrom<typeof model, 'VC_ADDED'>;
type VcReceivedEvent = EventFrom<typeof model, 'VC_RECEIVED'>;

export const vcMachine = model.createMachine(
  {
    id: 'vc',
    context: model.initialContext,
    initial: 'init',
    states: {
      init: {
        initial: 'myVcs',
        states: {
          myVcs: {
            entry: ['loadMyVcs'],
            on: {
              STORE_RESPONSE: {
                target: 'receivedVcs',
                actions: ['setMyVcs'],
              },
            },
          },
          receivedVcs: {
            entry: ['loadReceivedVcs'],
            on: {
              STORE_RESPONSE: {
                target: '#ready',
                actions: ['setReceivedVcs'],
              },
            },
          },
        },
      },
      ready: {
        id: 'ready',
        entry: [sendParent('READY')],
        on: {
          GET_RECEIVED_VCS: {
            actions: ['getReceivedVcsResponse'],
          },
          GET_VC_ITEM: {
            actions: ['getVcItemResponse'],
          },
          VC_ADDED: {
            actions: ['prependToMyVcs'],
          },
          VC_DOWNLOADED: {
            actions: ['setDownloadedVc'],
          },
          VC_RECEIVED: {
            actions: ['prependToReceivedVcs'],
          },
        },
        type: 'parallel',
        states: {
          myVcs: {
            initial: 'idle',
            states: {
              idle: {
                on: {
                  REFRESH_MY_VCS: 'refreshing',
                },
              },
              refreshing: {
                entry: ['loadMyVcs'],
                on: {
                  STORE_RESPONSE: {
                    target: 'idle',
                    actions: ['setMyVcs'],
                  },
                },
              },
            },
          },
          receivedVcs: {
            initial: 'idle',
            states: {
              idle: {
                on: {
                  REFRESH_RECEIVED_VCS: 'refreshing',
                },
              },
              refreshing: {
                entry: ['loadReceivedVcs'],
                on: {
                  STORE_RESPONSE: {
                    target: 'idle',
                    actions: ['setReceivedVcs'],
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
      getReceivedVcsResponse: respond((context) => ({
        type: 'VC_RESPONSE',
        response: context.receivedVcs,
      })),

      getVcItemResponse: respond((context, event: GetVcItemEvent) => {
        const vc = context.vcs[event.vcKey];
        return VcItemEvents.GET_VC_RESPONSE(vc);
      }),

      loadMyVcs: send(StoreEvents.GET(MY_VCS_STORE_KEY), {
        to: (context) => context.serviceRefs.store,
      }),

      loadReceivedVcs: send(StoreEvents.GET(RECEIVED_VCS_STORE_KEY), {
        to: (context) => context.serviceRefs.store,
      }),

      setMyVcs: model.assign({
        myVcs: (_, event: StoreResponseEvent) => event.response || [],
      }),

      setReceivedVcs: model.assign({
        receivedVcs: (_, event: StoreResponseEvent) => event.response || [],
      }),

      setDownloadedVc: (context, event: VcDownloadedEvent) => {
        context.vcs[VC_ITEM_STORE_KEY(event.vc)] = event.vc;
      },

      prependToMyVcs: model.assign({
        myVcs: (context, event: VcAddedEvent) => [
          event.vcKey,
          ...context.myVcs,
        ],
      }),

      prependToReceivedVcs: model.assign({
        receivedVcs: (context, event: VcReceivedEvent) => [
          event.vcKey,
          ...context.receivedVcs,
        ],
      }),
    },
  }
);

export function createVcMachine(serviceRefs: AppServices) {
  return vcMachine.withContext({
    ...vcMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof vcMachine>;

export function selectMyVcs(state: State) {
  return state.context.myVcs;
}

export function selectShareableVcs(state: State) {
  return state.context.myVcs.filter(
    (vcKey) => state.context.vcs[vcKey]?.credential != null
  );
}

export function selectReceivedVcs(state: State) {
  return state.context.receivedVcs;
}

export function selectIsRefreshingMyVcs(state: State) {
  return state.matches('ready.myVcs.refreshing');
}

export function selectIsRefreshingReceivedVcs(state: State) {
  return state.matches('ready.receivedVcs.refreshing');
}
