import { EventFrom, StateFrom } from 'xstate';
import { send, sendParent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { StoreEvents } from './store';
import { VC } from '../types/vc';
import { AppServices } from '../shared/GlobalContext';
import { respond } from 'xstate/lib/actions';
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
      STORE_RESPONSE: (response: unknown) => ({ response }),
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

export const vcMachine = model.createMachine(
  {
    tsTypes: {} as import('./vc.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'vc',
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

      getVcItemResponse: respond((context, event) => {
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
        myVcs: (_context, event) => (event.response || []) as string[],
      }),

      setReceivedVcs: model.assign({
        receivedVcs: (_context, event) => (event.response || []) as string[],
      }),

      setDownloadedVc: (context, event) => {
        context.vcs[VC_ITEM_STORE_KEY(event.vc)] = event.vc;
      },

      prependToMyVcs: model.assign({
        myVcs: (context, event) => [event.vcKey, ...context.myVcs],
      }),

      prependToReceivedVcs: model.assign({
        receivedVcs: (context, event) => [event.vcKey, ...context.receivedVcs],
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
