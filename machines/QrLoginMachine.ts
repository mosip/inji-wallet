import { assign, EventFrom, send, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { AppServices } from '../shared/GlobalContext';
import { MY_VCS_STORE_KEY } from '../shared/constants';
import { StoreEvents } from './store';
import { VC } from '../types/vc';
import { request, linkTransactionResponse } from '../shared/request';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    selectedVc: {} as VC,
    linkCode: '',
    myVcs: [] as string[],
    linkTransactionResponse: {} as linkTransactionResponse,
  },
  {
    events: {
      SELECT_VC: (vc: VC) => ({ vc }),
      SCANNING_DONE: (params: string) => ({ params }),
      STORE_RESPONSE: (response: unknown) => ({ response }),
      STORE_ERROR: (error: Error) => ({ error }),
      DISMISS: () => ({}),
      CONFIRM: () => ({}),
      VERIFY: () => ({}),
      CANCEL: () => ({}),
      FACE_VALID: () => ({}),
      FACE_INVALID: () => ({}),
      RETRY_VERIFICATION: () => ({}),
    },
  }
);

export const QrLoginEvents = model.events;

export const qrLoginMachine =
  /** @xstate-layout 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 */
  model.createMachine(
    {
      tsTypes: {} as import('./QrLoginMachine.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            SCANNING_DONE: {
              target: 'showWarning',
              actions: 'setScanData',
            },
            DISMISS: {
              target: 'idle',
            },
          },
        },
        showWarning: {
          on: {
            CONFIRM: {
              target: 'loadMyVcs',
            },
            DISMISS: {
              target: 'idle',
            },
          },
        },
        linkTransaction: {
          invoke: {
            src: 'linkTransaction',
            onDone: [
              {
                actions: 'setlinkTransactionResponse',
                target: 'loadMyVcs',
              },
            ],
          },
        },
        loadMyVcs: {
          entry: 'loadMyVcs',
          on: {
            STORE_RESPONSE: {
              actions: 'setMyVcs',
              target: 'showvcList',
            },
          },
        },
        showvcList: {
          on: {
            SELECT_VC: {
              actions: 'setSelectedVc',
            },
            VERIFY: {
              target: 'faceAuth',
            },
            DISMISS: {
              target: 'idle',
            },
          },
        },
        faceAuth: {
          on: {
            FACE_VALID: {
              target: 'requestConsent',
            },
            FACE_INVALID: {
              target: 'invalidIdentity',
            },
            CANCEL: {
              target: 'idle',
            },
          },
        },
        requestingJwtToken: {
          invoke: {
            src: 'requestingJwtToken',
            onDone: [
              {
                actions: '',
                target: 'done',
              },
            ],
            onError: [
              {
                actions: '',
                cond: '',
                target: '',
              },
              {
                actions: '',
                target: '',
              },
            ],
          },
        },
        invalidIdentity: {
          on: {
            DISMISS: {
              target: 'showvcList',
            },
            RETRY_VERIFICATION: {
              target: 'faceAuth',
            },
          },
        },
        requestConsent: {
          on: {
            CONFIRM: {
              target: 'done',
            },
            CANCEL: {
              target: 'idle',
            },
          },
        },
        done: {
          on: {
            DISMISS: {
              target: 'idle',
            },
          },
        },
      },
      id: 'QrLogin',
    },
    {
      actions: {
        setScanData: model.assign({
          linkCode: (_context, event) =>
            event.params.substring(
              event.params.indexOf('linkCode=') + 9,
              event.params.indexOf('&')
            ),
        }),

        loadMyVcs: send(StoreEvents.GET(MY_VCS_STORE_KEY), {
          to: (context) => context.serviceRefs.store,
        }),

        setMyVcs: model.assign({
          myVcs: (_context, event) => (event.response || []) as string[],
        }),

        setSelectedVc: assign({
          selectedVc: (context, event) => {
            return { ...event.vc };
          },
        }),

        setlinkTransactionResponse: assign({
          linkTransactionResponse: (context, event) => event.data,
        }),
      },
      services: {
        linkTransaction: async (context) => {
          const response = await request('POST', '/link-transaction', {
            linkCode: context.linkCode,
            requestTime: String(new Date().toISOString()),
          });
          return response.response;
        },
      },
    }
  );

export function createQrLoginMachine(serviceRefs: AppServices) {
  return qrLoginMachine.withContext({
    ...qrLoginMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof qrLoginMachine>;

export function selectMyVcs(state: State) {
  return state.context.myVcs;
}

export function selectIsScanning(state: State) {
  return state.matches('idle');
}

export function selectIsGeneratingJwtToken(state: State) {
  return state.matches('requestingJwtToken');
}

export function selectIsShowWarning(state: State) {
  return state.matches('showWarning');
}

export function selectIsloadMyVcs(state: State) {
  return state.matches('loadMyVcs');
}

export function selectIsShowingVcList(state: State) {
  return state.matches('showvcList');
}

export function selectIsisVerifyingIdentity(state: State) {
  return state.matches('faceAuth');
}

export function selectIsInvalidIdentity(state: State) {
  return state.matches('invalidIdentity');
}

export function selectIsRequestConsent(state: State) {
  return state.matches('requestConsent');
}

export function selectIsVerifyingSuccesful(state: State) {
  return state.matches('done');
}

export function selectSelectedVc(state: State) {
  return state.context.selectedVc;
}

export function selectLinkTransactionResponse(state: State) {
  return state.context.linkTransactionResponse;
}
