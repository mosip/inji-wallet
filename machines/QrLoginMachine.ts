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
  /** @xstate-layout N4IgpgJg5mDOIC5QEUBOAZA9lAlgOwDocIAbMAYgGUBhAQQDl6BJegcQH0ARAeXoFEA2gAYAuolAAHTLBwAXHJjziQAD0QBmAGyaCADiEB2dQFYATOtMBGXZoOWANCACeGgJyuCxg64AsQ44Y+rkI+ugC+YY5oWLiExGTknEyUALLJlMJiSCBSMvKKymoIVh7qZWXGugaaPjW6Po4uCBbqBELt7a7Gvpr1BhFRGNj4BLAAFpgA7gDqAIaoePhQ5NS8AGJMAEopmcq5cgpK2UXdlgQ+pgH6-u69uo2IlrVtBrqWAa9CpqY+-ZEg0WGhHGUzmCyWiWSaUoGVEe2kBwKx0Qmh+BE0T0sgWqmlcqIeCAAtGjXD9QkFLJdasZagMAUNYqMJpMAG4AY3QOFgsioABVuJs+OxBZQAAq8SiCOHZfb5I6gIqhVq2II+J6Gd6udQElXnELqVwGV6U4KWOmAxkg1kcrk8yXoPjUXnsABq1F2MoRcsKiEJFz1b0sWuMxksqIxBMJuIITy0plxwS+oeM5oZIyt7M53PILr4myYawAmh7JF7Dj6iWGfDH2lU+gYQxdtc5fZSzrjTAYrGYMe0w6mYiMAGazNlgWgAV1kY3Ia1o1CFLto6CYnBLOTLSNATV0rQ6nW6tXqmmbRV8rW+pKCVUuGoHQIII7Hk+ns-nQpYS5Xa+lpby5eRBA8Q8EJTETEwQgMHxmyaSxWm8Q8bC+UIhBsTR70ZJ9xynGc6HoBd0HXWUAIVRA8WrHxKh8WohFxJ4jAJb5jAIAxaNRawGzeUxdwwkZ8BZWYSGIJgIDAPB5FkJxIVSdIiM3eVVEQS4dFRYwCQbAwCHUBshEsLsfkMUleLiPABKEiARLEiSpMFXlNkLV08wLJg6F5JheDk-8t0U4pjBUy4CTeDwqgCPTvj8bxTAif48EwUT4GyC18HhLyFKKYlKRrVDXl+BsaXMSMrCEdFSSMNV1F+XQvCi-4kriUgwBSxE0sQIQCW0s59yELoej6YymVBeZFjwKAmu9QD1HqAhLysKpNFQ+MDECvd9x6o8j36jMbW5MaSJ8wlKVaYwtAxXd9E0Mx4wJLxgvUODWOCKoLH6rCXzGXbvKKHTpt0S51Fo-67rgglrGYspLjO+oDXcGrBkHEyzOE0TxLkJo-2ais2pbBBfp0Lq1t6X5+ogRRGs9VKKyxbQtPyo06PeEJlraDp-so65weisIgA */
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
              internal: false,
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
