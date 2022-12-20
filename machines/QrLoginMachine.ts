import { assign, ErrorPlatformEvent, EventFrom, send, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { AppServices } from '../shared/GlobalContext';
import { MY_VCS_STORE_KEY } from '../shared/constants';
import { StoreEvents } from './store';
import { linkTransactionResponse, VC } from '../types/vc';
import { request } from '../shared/request';
import { getJwt } from '../shared/cryptoutil/cryptoUtil';
import { getPrivateKey } from '../shared/keystore/SecureKeystore';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    selectedVc: {} as VC,
    linkCode: '',
    myVcs: [] as string[],
    linkTransactionResponse: {} as linkTransactionResponse,
    requestAuthResponse: '',
    authFactors: [],
    authorizeScopes: null,
    clientName: '',
    configs: {},
    essentialClaims: [],
    linkTransactionId: '',
    logoUrl: '',
    voluntaryClaims: [],
    errorMessage: '',
    consentClaims: ['name', 'picture'],
    isSharingBirthdate: false,
    isSharingPhone: false,
    isSharingGender: false,
  },
  {
    events: {
      SELECT_VC: (vc: VC) => ({ vc }),
      SCANNING_DONE: (params: string) => ({ params }),
      STORE_RESPONSE: (response: unknown) => ({ response }),
      STORE_ERROR: (error: Error) => ({ error }),
      TOGGLE_CONSENT_CLAIM: (enable: boolean, claim: string) => ({
        enable,
        claim,
      }),
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
  /** @xstate-layout N4IgpgJg5mDOIC5QEUBOAZA9lAlgOwDocIAbMAYgGUBhAQQDl6BJegcQH0ARAeXoFEA2gAYAuolAAHTLBwAXHJjziQAD0QBGACzqATAQCs+nZv0BmABzqL50zoA0IAJ6IA7KaEFNATnPmv6oUMhHUMAX1CHNCxcQmIyck4mSgBZJMphMSQQKRl5RWU1BF1zFwIvHQrTFxdNCxcANgdnBH16j1NbdT8vfW8q9XDIjGx8AhJ8AGsAFVQAQzxYWYBjPLxyCEUwIjwAN0wJraiRwnG8abmF5dWEfD2l2dWMjOUcuQUlLMKtXQMjEwsrL5bE1EF4XOYCEJ6iEXF4ekIOppzIMQEcYmNJjN5osVu9yGBUKhMKgCBISA8AGbEgC2BDRo1O52xV3eN12mHuj1Ezyyr1WBQ0JQhmlhotMZmM+hcIIQNX0nnUhh65h06hcOhKKPphFgAAtMAB3ADqs1QeHwUHI1F4ADEmAAlZI8yTSN75T6IEIeHT+eo1Lyaeriwwy+pggiwtXw9SKjU6LXDdF6w0ms0Wq0Mah8dDO7Ku-kehBegg+9R+7yB4P6GV+dQRlwBIRqoTqjX1BPRUaUfUGviE4kZ+hZnOiF7594Coo9TSQtyqqUx9zApyINpeCNIoVaYzlUwd45jTCzCDJRwANSWsCoU249r47DvlAACrxKIJR7zx+7QIU-fLofoMaATYWjaKGLjylCOjQi4gSmJoOgNPuSY9jsSzoDgsCyFQ2Z8NQUzsGe1C5nyE6Fr4M4BkI3j6DYtEttWK4tDGEb1H6DbmEYAZschozJgaaEYVh5Bnnw9pMDaACaJFfh8P6uLRZRIoqKl0UI5gyiK9SQtobjUZu0KaLxOqoehmHYYkKRpDJuRkfJRTqRCpj1PoTYBj01QVKGPwVIBHT6AGqq1MZBAUssYC0AArrIurkDatBZoRtDoEwnA2W6cmqJ6rklr6-qVoYjHNP4kI2Jo1ENr01EBiFYVLBF0WxfFiUsGeyWpelBb2cWpbltxVahiKuVqmGXT1IG6heLV4VRTFg7Dp1dlZUWOW9flQaFTW2glrBYK0SqZaqiFtyzOMEBMBAYB4PIsiOAkSSpJQ6Qfi6tnfstf4EABQFdKYoHqKG1EECUrnmEIcJ+FC7YRKiiajCdZ0XVdN13XeUz2pJhFiRJTB0FMTC8It72FD1eUVhtIZMQF2mRjUHT1FYPTQ0MnaEKgYAAI6RXAsjUIosDI1atoOk6L15m9mW-hBX0hD9IGaGBTEIfKvTNoGOhVF4zOw6zBDs1zPN8wsgt0EO2ZE5Lq7S99ql-QrANMe4M6RqNDa6NC5hGTD2oEBseAUJZj3PZkr0ZZOAS+AQzmuZNNGefYSshAYunUdCmvaz7+vc1hFpGwL13rJs2x7AcdJw2znPZ-IeBQHnyNsncDzvE8YukcTq42GUYYtuNgFsQGMqqnWNjwSNiFeACe7e+XeuVzzuf84LBJEiSZKUjSZe61n8813X10NxyTeKC3Ifi2HhYR05LluXHrY1qYO2OanY1sciKJ4Jgl3wFk2pjhLk4AFpGhMQAfKOE4CIGQKnizA8cQwB-3PvZYoEJVT+FVCUaC-hNDeXlDYCoipwRCCIeKEKjIsSXFxO9NulsiguWdpYIMQZoK9F6DKOmX0FYQSITHHoU1p6634qmc0NcEFdWWghNh4MCBlnqGDLQ7EAxvxgeibsho+wr1EUtEmLYIQqmjvbeCKoiqrgCCWTc4JtzeA1qQo8J5zyXk0e3BAIph7jTYvBQIwQLDgWdv4Bo5UkTqjMCFfiglzKOJoX4bS4oGyIR9FUIhCdmgMz0EEqw4pApaGgTrA8dUGoxQiZOGoX0Si1CDFYAKCEkkaChKVUeHQNYNGosdXYp1iBI2unIZoocxGFCRHoKU40VT+H2n4QG8oqig3Bj4LwUIXAhW3lhPeshCmFiROucqhlYK6AXA7Zoxg6wTwgv09JHRfAhT9vAz8-9Cz+HXJUxUCIzBIiRJpaCOkRoNlMGCME8EFlzxzrvRe11Vn2RBtI1oDM-pGAsF4GsdZXJEI8n8Go41wjhCAA */
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
              target: 'requestingConsent',
            },
            TOGGLE_CONSENT_CLAIM: {
              actions: 'setConsentClaims',
              target: 'requestConsent',
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

        requestingConsent: {
          invoke: {
            src: 'sendConsent',
            onDone: {
              target: 'done',
            },
            onError: [
              {
                actions: 'SetErrorMessage',
                target: 'ShowError',
              },
            ],
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

        setConsentClaims: assign({
          isSharingBirthdate: (_context, event) => {
            if (event.claim === 'birthdate') {
              if (event.enable) {
                _context.consentClaims.push(event.claim);
              } else {
                _context.consentClaims = _context.consentClaims.filter(
                  (claim) => claim !== event.claim
                );
              }
              return event.enable;
            } else {
              return _context.isSharingBirthdate;
            }
          },
          isSharingGender: (_context, event) => {
            if (event.claim === 'gender') {
              if (event.enable) {
                _context.consentClaims.push(event.claim);
              } else {
                _context.consentClaims = _context.consentClaims.filter(
                  (claim) => claim !== event.claim
                );
              }
              return event.enable;
            } else {
              return _context.isSharingGender;
            }
          },
          isSharingPhone: (_context, event) => {
            if (event.claim === 'phone') {
              if (event.enable) {
                _context.consentClaims.push(event.claim);
              } else {
                _context.consentClaims = _context.consentClaims.filter(
                  (claim) => claim !== event.claim
                );
              }
              return event.enable;
            } else {
              return _context.isSharingPhone;
            }
          },
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

        sendConsent: async (context) => {
          console.log('Individual id : ' + context.selectedVc.id);
          const resp = await request('POST', '/idp-authenticate', {
            requestTime: String(new Date().toISOString()),
            request: {
              linkedTransactionId: context.linkTransactionId,
              individualId: '3295638027105149',
              challengeList: [
                {
                  authFactorType: 'OTP',
                  challenge: '111111',
                },
              ],
            },
          });
          const trnId = resp.response.linkedTransactionId;

          const response = await request('POST', '/idp-consent', {
            requestTime: String(new Date().toISOString()),
            request: {
              linkedTransactionId: trnId,
              acceptedClaims: ['email'],
              permittedAuthorizeScopes: [],
            },
          });
          console.log(response.response.linkedTransactionId);
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

export function selectIsSharingBirthdate(state: State) {
  return state.context.isSharingBirthdate;
}

export function selectIsSharingPhone(state: State) {
  return state.context.isSharingPhone;
}

export function selectIsSharingGender(state: State) {
  return state.context.isSharingGender;
}

export function selectIsRequestingConsent(state: State) {
  return state.matches('requestingConsent');
}
