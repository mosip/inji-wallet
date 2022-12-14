import { assign, ErrorPlatformEvent, EventFrom, send, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { AppServices } from '../shared/GlobalContext';
import { MY_VCS_STORE_KEY } from '../shared/constants';
import { StoreEvents } from './store';
import { linkTransactionResponse, VC } from '../types/vc';
import { request } from '../shared/request';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    selectedVc: {} as VC,
    linkCode: '',
    myVcs: [] as string[],
    linkTransactionResponse: {} as linkTransactionResponse,
    authFactors: [],
    authorizeScopes: null,
    clientName: '',
    configs: {},
    essentialClaims: [],
    linkTransactionId: '',
    logoUrl: '',
    voluntaryClaims: [],
    errorMessage: '',
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
  /** @xstate-layout N4IgpgJg5mDOIC5QEUBOAZA9lAlgOwDocIAbMAYgGUBhAQQDl6BJegcQH0ARAeXoFEA2gAYAuolAAHTLBwAXHJjziQAD0QBGIQA4ATAXUAWAKwB2MwfMBOAwYA0IAJ6IAzCfUEAbEaFDXHj0ImWiYGHgC+YfZoWLiExGTknEyUALLJlMJiSCBSMvKKymoIlqYERupGRgbqlkI6FpaW9k4IOh7Ont4+Rs6NWr5azhFRGNj4BLAAFpgA7gDqAIaoePhQ5NS8AGJMAEopmcq5cgpK2UWGlh2WJrVaBlr+DxXNLlpaBDdGWuXqHoP1wxA0TGhCms0Wy1WiWSaUoGVEh2kxwKZw0FSEBGcVR02j+OnU5heCGc+P0XSENW0X1CJkBwNiBBI+AA1gAVVALPCwBYAY3yeHIEEUYCIeAAbphmSL6eMmXg2Ryubz+Qh8BKeQt+ZkDtkjvzChoDJcCNdbvdHh5no5EDpvmV-P5nFpNB4LIE6aMGSRMAsICkHAA1HmwKis7g7PjsCOUAAKvEoggRuqR+tRCBqOksJr+7S0tWurqJzlcHyqGZuBiElnUQ0iQM94zBMzFPPQOFgsiofHQfGorPYAeoOskKZOBtaFXclhzpiEHh0zgsRMqJkxvxMznUW7aFnUHpijemzdb7c7Ab4OyYmwAmsOcqOUaAijicR8Ak71DoTP56kYif4DH0as3EGIRqldWk6xlUEjxbNsO2hVJ0jvPUxzTHFPwIMDfkMQxbTcdQiV+DowNMIIAiEIxLGdfcQQIAAzXkwFoABXWRJnITZaGoSMA1odAmE4FCH1OJ8NDMTxsI8b9NAsNodCLX4ykGEkumuHpXFohlGJ5Zi2I4riePYFg+IEoSkxHPI0LE9MJICcCZLAkx5OXAwOhsAl+iCZxXRqLTxh0vT2PWBgePQYSrMfVRxNXez10tJyXOtBBnQII1GktN5MwJfx-LicUFiZCAmAgMA8HkWQHEQ2F4SySzkVE6KEFnTESiCb4TC+atCOSnpV2+QZLRrAJMyMPLRTFQriBKsqKqqiNWR2a8BwvK8mDoVkmF4CKGvHAlYqkxy5PnIkjT0awCWMXxDF6cbUDAABHFi4FkahFFgWb1i2XZ9gs+9IsaooWt6Uw3lMLqtyLHRzsaRpvyxT9KLux7no7N6uU+uh6DCnbUxs4G2rBzq80h5KXwIeo4fU2pKS0cahTwCgkiQuFcesprdD0MGnW+cozC0KGYdh+HyhxMbATwTBSvgbJoMRAHxwAWg8IllawnxKPKHoKWcMCDHG+IwHl3a0zaghnR0bx5xxedrEUrN0WwiocTnSCRgPGDwSWFY8CgY28aaz8SjS35XVMCwnV6Is8wpkpvi3P4SX1qCG0IOUFU5bk+XZ1CovOepV11qpXUt-xnKJfEPE8TnqOrbFOrd+sPcZH0-UDYN-fZ84NyrnFnTuKivnwotvA+T90stjXq3Gps4NPTu85tYjMW+Rd8QeCk7GSrx3i-bxnNCXpanF926MC1j2IXwHEAMBTkqNIwTWqXQemCCkQhPpu6LVKbitK8q5AtHqgHIolY9CuCNMEO404nR3xaK-TEXwfJbh8nUEoyMnovXRh9cqV9xxH30GYbQFg3ByUqIpVc2hiyTyrJ1YsjdoIEAZkbZMCs0wmF8GUIwOIsSBDnD4LeLQSTuVhgWBGYsIgRCAA */
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
              actions: 'setScanData',
              target: 'linkTransaction',
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
                actions: ['setlinkTransactionResponse', 'expandLinkTransResp'],
                target: 'showWarning',
              },
            ],
            onError: [
              {
                actions: 'SetErrorMessage',
                target: 'ShowError',
              },
            ],
          },
        },
        showWarning: {
          on: {
            CONFIRM: {
              target: 'loadMyVcs',
            },
            CANCEL: {
              target: 'idle',
            },
          },
        },
        ShowError: {
          on: {
            CANCEL: {
              target: 'idle',
            },
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
          linkTransactionResponse: (context, event) =>
            event.data as linkTransactionResponse,
        }),

        expandLinkTransResp: assign({
          authFactors: (context) => context.linkTransactionResponse.authFactors,

          authorizeScopes: (context) =>
            context.linkTransactionResponse.authorizeScopes,

          clientName: (context) => context.linkTransactionResponse.clientName,

          configs: (context) => context.linkTransactionResponse.configs,

          essentialClaims: (context) =>
            context.linkTransactionResponse.essentialClaims,

          linkTransactionId: (context) =>
            context.linkTransactionResponse.linkTransactionId,

          logoUrl: (context) => context.linkTransactionResponse.logoUrl,

          voluntaryClaims: (context) =>
            context.linkTransactionResponse.voluntaryClaims,
        }),

        SetErrorMessage: assign({
          errorMessage: (context, event) =>
            (event as ErrorPlatformEvent).data.message,
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

export function selectIsLinkTransaction(state: State) {
  return state.matches('linkTransaction');
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

export function selectIsShowError(state: State) {
  return state.matches('ShowError');
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

export function selectVoluntaryClaims(state: State) {
  return state.context.voluntaryClaims;
}

export function selectLogoUrl(state: State) {
  return state.context.logoUrl;
}

export function selectClientName(state: State) {
  return state.context.clientName;
}

export function selectErrorMessage(state: State) {
  return state.context.errorMessage;
}
