import { assign, ErrorPlatformEvent, EventFrom, send, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { VC_ITEM_STORE_KEY } from '../shared/constants';
import { AppServices } from '../shared/GlobalContext';
import { CredentialDownloadResponse, request } from '../shared/request';
import {
  VC,
  VerifiableCredential,
  VcIdType,
  DecodedCredential,
} from '../types/vc';
import { StoreEvents } from './store';
import { ActivityLogEvents } from './activityLog';
import { verifyCredential } from '../shared/verifyCredential';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    id: '',
    idType: '' as VcIdType,
    tag: '',
    generatedOn: null as Date,
    credential: null as DecodedCredential,
    verifiableCredential: null as VerifiableCredential,
    requestId: '',
    isVerified: false,
    lastVerifiedOn: null,
    locked: false,
    otp: '',
    otpError: '',
    idError: '',
    transactionId: '',
  },
  {
    events: {
      EDIT_TAG: () => ({}),
      SAVE_TAG: (tag: string) => ({ tag }),
      STORE_READY: () => ({}),
      DISMISS: () => ({}),
      CREDENTIAL_DOWNLOADED: (vc: VC) => ({ vc }),
      STORE_RESPONSE: (response: VC) => ({ response }),
      POLL: () => ({}),
      DOWNLOAD_READY: () => ({}),
      GET_VC_RESPONSE: (vc: VC) => ({ vc }),
      VERIFY: () => ({}),
      LOCK_VC: () => ({}),
      UNLOCK_VC: () => ({}),
      INPUT_OTP: (otp: string) => ({ otp }),
    },
  }
);

export const VcItemEvents = model.events;

export const vcItemMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDcDGBaAlgFzAWwDpUALMVAa0wDsoA1VAYgHEBRAFQH1aBhDgJRYBlAAoB5AHKCWiUAAcA9rByZ5VGSAAeiAMwAWAEwFtABmMB2ABwBGfQFYANCACeiK29sEAbLasBOMwbe2r5WFgC+YY5oWLiEJGSUNILY8gBOYAyCbKIC-EJiktJIIApK2CpqxVoI+v4Evr6elsbBtrbmFo4uCBZmZl4+DbbBtbqeEVEYOPhEpBTUUIJgqcjLACIAhtgbswkLyVsArrAMYgAyZ+qlyqrq1Vaehp5WxrX6umZW2mb6D12Inm02gItnepj6r10FlsExA0WmcTmiUWy1WqU22128yS22wxwYa1EAHVxGdRABBNZ5SkATSuihulVA1T0ngIAVsnmMtjGvQczkQAQsXjBLwsFg61lh8NiWORSxW6y2Owg8gA7lQADbyDYQBbcdIQMBUcobTWnUQXellCp3AG2YVNNpmJpc369f4ITy6KwgzwS-TGXTmfzSqay+LYlGK9HKgiqjXa3X6w3G03m7gCNYscRsACS5LOHEJJLJlJYa2tjLtCBCvuMoWM4uhBhd+k9ZhaA0DVkswf8+m0YZiM0wEE1GQrec4bHJTCr5VuVUQdYIDYlzZ5+jbnodugIVlBDf9jTGZl8w4RBDHE4YtBYfDzADE6cVroumZpXH5hZ8bHpjF8bcbF0T0TH3Q9A2MZ4TF8UErEvWVIGUGg2A2KACTzQQAFksMEBdbWXBBQn3CwDG0MigQsb4LF8T03GBNooL8YYbBhSI4XDGZkPKVD0Mycl7w4Wd5zfBkPxrVd1ybcUtx3AUam0NlvCgwJfF0YZ9EQmZYBSVIFjQjCshyFg8hECQpAIpdmW-XxfzcQd+2A95PTsNlINMAwfXUoFxg4mUZjRTAADMnBTSA00wM0GFVKgwGvKhkHkch4oCwggtC8KjRNKLNQQagktQLYKgAbWMABdKzP3uED6kHT5tHeEYoTA0EDyPJsGwaLlwn8rj0uWEKwpoA0Ipy6LllSNICFkTUtmCtJ0v6ggMuGqBRuy9N8sS+Qio-MrKrEm1rK-YjaqA74viaoCWoU3Q6g8w9oPeSxesmEdET2GhaEG4LMD2ioDjxE4qprKwoQghsvjcDSIU6BTrEMUEuW5OxaO3CIOKoeQjXgYo0rlBZ6FBoiDHow9+m8BoW1PD52Peq9I3lPSwBJmyEDJhTfD0dqGhCXpelGbTPqjBU0QxHYmf2XFjjZ06+g7OwQTBQDhm9AIEL6j7CaSVElUxBMtR1PURtTcbNTl6phl8AhoQ3QZfk8Tw6IUswgT9AN9HeFigOFnXo3F5VLcQYZd1eZXgj6Z2yMHC8tavG9WaO6siKem2XgYmHbDh+jtxBaxTG8Xs+k7Mw-Z4gz0ODjn2wUtz2X9Lqnc7Cj6c47XdLSSuoGrl4lK8blnm3HkLHdVz3dR0x9Fottub8hnZVWrLIrNaupMbTdW0eMCzA8SfALsUU24JqXvt+-7itUIHZeTiTU+L23uf-IFGs7eHul3m2+glEMAgacHha93fjoEER5gKHg0u0D4mMwhAA */
  model.createMachine(
    {
      tsTypes: {} as import('./vcItem.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      description: 'VC',
      id: 'vc-item',
      initial: 'checkingVc',
      states: {
        checkingVc: {
          entry: 'requestVcContext',
          description:
            'Check if the VC data is in VC list already (in memory).',
          on: {
            GET_VC_RESPONSE: [
              {
                actions: 'setCredential',
                cond: 'hasCredential',
                target: 'checkingVerificationStatus',
              },
              {
                target: 'checkingStore',
              },
            ],
          },
        },
        checkingStore: {
          entry: 'requestStoredContext',
          description: 'Check if VC data is in secured local storage.',
          on: {
            STORE_RESPONSE: [
              {
                actions: ['setCredential', 'updateVc'],
                cond: 'hasCredential',
                target: 'checkingVerificationStatus',
              },
              {
                target: 'checkingServerData',
              },
            ],
          },
        },
        checkingServerData: {
          description:
            "Download VC data from the server. Uses polling method to check when it's available.",
          initial: 'checkingStatus',
          states: {
            checkingStatus: {
              invoke: {
                src: 'checkStatus',
                id: 'checkStatus',
              },
              on: {
                POLL: {
                  actions: send('POLL_STATUS', { to: 'checkStatus' }),
                },
                DOWNLOAD_READY: {
                  target: 'downloadingCredential',
                },
              },
            },
            downloadingCredential: {
              invoke: {
                src: 'downloadCredential',
                id: 'downloadCredential',
              },
              on: {
                POLL: {
                  actions: send('POLL_DOWNLOAD', { to: 'downloadCredential' }),
                },
                CREDENTIAL_DOWNLOADED: {
                  actions: [
                    'setCredential',
                    'storeContext',
                    'updateVc',
                    'logDownloaded',
                  ],
                  target: '#vc-item.checkingVerificationStatus',
                },
              },
            },
          },
        },
        idle: {
          entry: ['clearTransactionId', 'clearOtp'],
          on: {
            EDIT_TAG: {
              target: 'editingTag',
            },
            VERIFY: {
              target: 'verifyingCredential',
            },
            LOCK_VC: {
              target: 'requestingOtp',
            },
            UNLOCK_VC: {
              target: 'requestingOtp',
            },
          },
        },
        editingTag: {
          on: {
            DISMISS: {
              target: 'idle',
            },
            SAVE_TAG: {
              actions: 'setTag',
              target: 'storingTag',
            },
          },
        },
        storingTag: {
          entry: 'storeTag',
          on: {
            STORE_RESPONSE: {
              target: 'idle',
            },
          },
        },
        verifyingCredential: {
          invoke: {
            src: 'verifyCredential',
            onDone: [
              {
                actions: ['markVcValid', 'storeContext', 'updateVc'],
                target: 'idle',
              },
            ],
            onError: [
              {
                actions: 'logError',
                target: 'idle',
              },
            ],
          },
        },
        checkingVerificationStatus: {
          description:
            'Check if VC verification is still valid. VCs stored on the device must be re-checked once every [N] time has passed.',
          always: [
            {
              cond: 'isVcValid',
              target: 'idle',
            },
            {
              target: 'verifyingCredential',
            },
          ],
        },
        invalid: {
          states: {
            otp: {},
            backend: {},
          },
          on: {
            INPUT_OTP: {
              target: 'requestingLock',
              actions: ['setOtp'],
            },
            DISMISS: 'idle',
          },
        },
        requestingOtp: {
          entry: ['setTransactionId'],
          invoke: {
            src: 'requestOtp',
            onDone: '#acceptingOtpInput',
            onError: {
              target: 'invalid.backend',
            },
          },
        },
        acceptingOtpInput: {
          id: 'acceptingOtpInput',
          entry: ['clearOtp'],
          on: {
            INPUT_OTP: {
              target: 'requestingLock',
              actions: ['setOtp'],
            },
            DISMISS: {
              target: 'idle',
              actions: ['clearOtp', 'clearTransactionId'],
            },
          },
        },
        requestingLock: {
          invoke: {
            src: 'requestLock',
            onDone: {
              target: 'lockingVc',
              actions: ['setLock'],
            },
            onError: {
              target: 'acceptingOtpInput',
              actions: ['setOtpError'],
            },
          },
        },
        lockingVc: {
          entry: ['storeLock'],
          on: {
            STORE_RESPONSE: 'idle',
          },
        },
      },
    },
    {
      actions: {
        updateVc: send(
          (context) => {
            const { serviceRefs, ...vc } = context;
            return { type: 'VC_DOWNLOADED', vc };
          },
          { to: (context) => context.serviceRefs.vc }
        ),

        requestVcContext: send(
          (context) => ({
            type: 'GET_VC_ITEM',
            vcKey: VC_ITEM_STORE_KEY(context),
          }),
          {
            to: (context) => context.serviceRefs.vc,
          }
        ),

        requestStoredContext: send(
          (context) => StoreEvents.GET(VC_ITEM_STORE_KEY(context)),
          {
            to: (context) => context.serviceRefs.store,
          }
        ),

        storeContext: send(
          (context) => {
            const { serviceRefs, ...data } = context;
            return StoreEvents.SET(VC_ITEM_STORE_KEY(context), data);
          },
          {
            to: (context) => context.serviceRefs.store,
          }
        ),

        setTag: model.assign({
          tag: (_, event) => event.tag,
        }),

        storeTag: send(
          (context) => {
            const { serviceRefs, ...data } = context;
            return StoreEvents.SET(VC_ITEM_STORE_KEY(context), data);
          },
          { to: (context) => context.serviceRefs.store }
        ),

        setCredential: model.assign((_, event) => {
          switch (event.type) {
            case 'STORE_RESPONSE':
              return event.response;
            case 'GET_VC_RESPONSE':
            case 'CREDENTIAL_DOWNLOADED':
              return event.vc;
          }
        }),

        logDownloaded: send(
          (_, event) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: VC_ITEM_STORE_KEY(event.vc),
              action: 'downloaded',
              timestamp: Date.now(),
              deviceName: '',
              vcLabel: event.vc.tag || event.vc.id,
            }),
          {
            to: (context) => context.serviceRefs.activityLog,
          }
        ),

        markVcValid: assign((context) => {
          return {
            ...context,
            isVerified: true,
            lastVerifiedOn: Date.now(),
          };
        }),

        setTransactionId: assign({
          transactionId: () => String(new Date().valueOf()).substring(3, 13),
        }),

        clearTransactionId: assign({ transactionId: '' }),

        setOtp: model.assign({
          otp: (_, event) => event.otp,
        }),

        setOtpError: assign({
          otpError: (_context, event) =>
            (event as ErrorPlatformEvent).data.message,
        }),

        clearOtp: assign({ otp: '' }),

        setLock: assign({
          locked: (context) => !context.locked,
        }),

        storeLock: send(
          (context) => {
            const { serviceRefs, ...data } = context;
            return StoreEvents.SET(VC_ITEM_STORE_KEY(context), data);
          },
          { to: (context) => context.serviceRefs.store }
        ),
      },

      services: {
        checkStatus: (context) => (callback, onReceive) => {
          const pollInterval = setInterval(
            () => callback(model.events.POLL()),
            5000
          );

          onReceive(async (event) => {
            if (event.type === 'POLL_STATUS') {
              const response = await request(
                'GET',
                `/credentialshare/request/status/${context.requestId}`
              );
              switch (response.response?.statusCode) {
                case 'NEW':
                  break;
                case 'ISSUED':
                case 'printing':
                  callback(model.events.DOWNLOAD_READY());
                  break;
              }
            }
          });

          return () => clearInterval(pollInterval);
        },

        downloadCredential: (context) => (callback, onReceive) => {
          const pollInterval = setInterval(
            () => callback(model.events.POLL()),
            5000
          );

          onReceive(async (event) => {
            if (event.type === 'POLL_DOWNLOAD') {
              const response: CredentialDownloadResponse = await request(
                'POST',
                '/credentialshare/download',
                {
                  individualId: context.id,
                  requestId: context.requestId,
                }
              );

              callback(
                model.events.CREDENTIAL_DOWNLOADED({
                  credential: response.credential,
                  verifiableCredential: response.verifiableCredential,
                  generatedOn: new Date(),
                  id: context.id,
                  idType: context.idType,
                  tag: '',
                  requestId: context.requestId,
                  isVerified: false,
                  lastVerifiedOn: null,
                  locked: context.locked,
                })
              );
            }
          });

          return () => clearInterval(pollInterval);
        },

        verifyCredential: async (context) => {
          return verifyCredential(context.verifiableCredential);
        },

        requestOtp: async (context) => {
          try {
            return request('POST', '/req/otp', {
              individualId: context.id,
              individualIdType: context.idType,
              otpChannel: ['EMAIL', 'PHONE'],
              transactionID: context.transactionId,
            });
          } catch (error) {
            console.error(error);
          }
        },

        requestLock: async (context) => {
          let response = null;
          if (context.locked) {
            response = await request('POST', '/req/auth/unlock', {
              individualId: context.id,
              individualIdType: context.idType,
              otp: context.otp,
              transactionID: context.transactionId,
              authType: ['bio'],
              unlockForSeconds: '120',
            });
          } else {
            response = await request('POST', '/req/auth/lock', {
              individualId: context.id,
              individualIdType: context.idType,
              otp: context.otp,
              transactionID: context.transactionId,
              authType: ['bio'],
            });
          }
          return response.response;
        },
      },

      guards: {
        hasCredential: (_, event) => {
          const vc =
            event.type === 'GET_VC_RESPONSE' ? event.vc : event.response;

          return vc?.credential != null && vc?.verifiableCredential != null;
        },

        isVcValid: (context) => {
          return context.isVerified;
        },
      },
    }
  );

export const createVcItemMachine = (
  serviceRefs: AppServices,
  vcKey: string
) => {
  const [, idType, id, requestId] = vcKey.split(':');
  return vcItemMachine.withContext({
    ...vcItemMachine.context,
    serviceRefs,
    id,
    idType: idType as VcIdType,
    requestId,
  });
};

type State = StateFrom<typeof vcItemMachine>;

export function selectVc(state: State) {
  const { serviceRefs, ...data } = state.context;
  return data;
}

export function selectGeneratedOn(state: State) {
  return new Date(state.context.generatedOn).toLocaleDateString();
}

export function selectId(state: State) {
  return state.context.id;
}

export function selectIdType(state: State) {
  return state.context.idType;
}

export function selectTag(state: State) {
  return state.context.tag;
}

export function selectCredential(state: State) {
  return state.context.credential;
}

export function selectVerifiableCredential(state: State) {
  return state.context.verifiableCredential;
}

export function selectIsEditingTag(state: State) {
  return state.matches('editingTag');
}

export function selectIsOtpError(state: State) {
  return state.context.otpError;
}

export function selectOtpError(state: State) {
  return state.context.otpError;
}

export function selectIsLockingVc(state: State) {
  return state.matches('lockingVc');
}

export function selectIsAcceptingOtpInput(state: State) {
  return state.matches('acceptingOtpInput');
}

export function selectIsRequestingOtp(state: State) {
  return state.matches('requestingOtp');
}
