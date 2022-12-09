import { assign, ErrorPlatformEvent, EventFrom, send, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { MY_VCS_STORE_KEY, VC_ITEM_STORE_KEY } from '../shared/constants';
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
import { verifyCredential } from '../shared/vcjs/verifyCredential';
import { log } from 'xstate/lib/actions';
import { generateKeys } from '../shared/rsakeypair/rsaKeypair';
import { KeyPair } from 'react-native-rsa-native';
import {
  getPrivateKey,
  savePrivateKey,
} from '../shared/keystore/SecureKeystore';
import { localAssets } from 'expo-updates';

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
    revoked: false,
    walletBindingId: '',
    walletBindingError: '',
    publicKey: '',
  },
  {
    events: {
      KEY_RECEIVED: (key: string) => ({ key }),
      KEY_ERROR: (error: Error) => ({ error }),
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
      INPUT_OTP: (otp: string) => ({ otp }),
      REFRESH: () => ({}),
      REVOKE_VC: () => ({}),
      ADD_WALLET_BINDING_ID: () => ({}),
      BINDING_DONE: () => ({}),
    },
  }
);

export const VcItemEvents = model.events;

export const vcItemMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDcDGBaAlgFzAWwGIAlAUQDFSBlACQG0AGAXUVAAcB7WHTdgOxZAAPRABYATABoQAT0QBGMQA4ArADpFATnEB2AGwBmMcrEjFAXzNS0WXHlWoAFmFQBrTLygA1VAQDiJABUAfU8AYSCqAAUAeQA5ShIGZiQQDi5sHn4U4QQROX1VXRFlDTlNXV1tPX0pWQQ5YzFVekU5PW0NXXzFDosrDBx8eydXdy8ff2CwiJJKGPjEuWS2Tm4+ARy8gqKSss7K6tr5EXpdQpFxVoV9RX19ZT6Qa0G7R2c3D0psdgAnMAJKAFoqQZnM4gkkgI0mssqAcopJDJRHINIpVPcxLorroxBoNGJHs9bMN3mMvr9-oDgSRQfMIUsoasMutsvJ6CJtKoOm08WI7hplPQakj6ko1Kd6FpcaVSg9LE8BsS3qNPmAfsg1QARACG2G1JJVUC+uoArrACDEADKWyEpaHM2FCRBiNqqIzGFEqHGYipHBD6UpNOT0TFGfHaejaRQiQmKobKj5GtUan46vUGxPG7Bmgia6IAdViluiAEFNTMywBNW0rdKZDbIjSqYPiModJTsjR+k76M4SjQB0oh0y6WM2eMjTPJrW6-UQdgAd14ABt2NqIGNQn8IGBeBltcuLdFrTXUkz66yEFV6KoLkojDpWgi-QGxJyyspNJKhUotGOXhmZLTqms6qPOS6ruum7bru+6HqEpCaiQsQBAAkiWlpBHmhbFmWJCaqe9oXnCbLKCIzb3IKqINLoAovqiaLaG+ZHaPo4ghnIMbykSQyYBAy7-PhqHBAEJa+IR54siR9Qok2ygeqibEGJGL7cs2ii6EKmh4oYQr-sSfECQQngkEQqFkNWTCMnWUlOggYgOWcPTGCIOIDrRcjdm+ciqMoKI3DcGiSmxcr9OOdiGf8xahAA0iEoQSTZjo5N56J3AFYhCuyyjCnUulNBGlTRnymmVKFCrhaokXECQnjRDFNJhIlMINqKfoKPpvH8f8ZblvmGGWoEQQAEKobEmpjb4QSoQRVl2pJyXOliBRsScwZ4iGLoviiZxdK5rQGPiLqdXYkDcB4ATalAuaoZQACyt2UM1DqtXIsm+QptyufoKkir2Ea3vceKfoKBzlTxp0bhkF1XQCJYmUEoniXNtYtZeb2aB9LqKd9v15YK5EOdU9A7b2A4naosDfD8YyXddVIglE4KJCjZ5Ja9gpokK+RMYKbQKNoL4E26b7KaTtH6BTKaYAAZtI0GQLBmAHgQ868GAVW8Mg7AuBrEOqNLcsKzue7K8uCDuNrqC6pkSTPcRdkOXITnaC5blk55Io9k0WIlNoewGFUUtqrL8seFuiumyrao-L8qisMuuoy78dj64bYdQBHJtwRbWvsNbDp26zRG2SljnqK7Jjux53ZtGiyiacDGj+-o2hcWFAEJmMnghzLmAF5kWY5vbpfyK0TaKF6lTBfJWL0Zx6klPibFRqYBLcXGryTt3vf9zbfBD+atAMvN7Po+P6hTxGA6z4oXk5ecIj6GUwYk50FOWwefEEGNkQAKrBGiAESII9Fr2X9mlO4txMo-WKLlRAP1ey3lRMUPy9AG58g-lrL+EAbr3UeqA1qqV0oZSynAl8AU3SnCjPJAUD5Rwb0qn8AAjiaOA0MoDRGwKwVWfANaWx1nrTeqgWFsKpmMLhrBc5W33rwIuyw2Zo2kiYTkWgOiTxaJiVoNw-RBTRJxC4rEBSGE5hTUR7CJHcIIDHOOCck4pwNsI8x4iPCSOkfnWR8jrJKMdsoVRHIGKaKxJxdqKIgwhgjNGXmtwKbalQKgMArAOGSNQrwVgJpsA-1iP-QBwDCGXnuDeIoXRW5aF7FRXQfolA9EKHyC40Zm64juLE+JiTkncNSekzJE18GUCesXBarU2JFNcjzMpugKlVMqE0EwtwmLsn9sdRhAE4kJKSWMIgYBta606RkrJOSghAJAQMs+yiVDnBKOyFEkoXRvj9K7JsbcVCfjaCcepLS1kcM2dssAuzum3Qen0-JZy1A7CCnkIK+IBYvg5FyIKHF8QaVKBUMxYBWEWI8JafOLheHq01j8xxTC0ViI4Vi1w7iB58C8afHxOQ24FGdrRIo6DIxNKqaULmT4Qp5HbKi9FLioBkpxTYn48dE7YGTj8VOTjiUYsFdiilnimDArsoU84JSOhPwmZKSpIo3xaEKNqzSfiqiGG0BTVchpvAAiBIzWYdIWYKJLmAt6ztbzO00K3b8Qp4H2QHE2Z+koOT0BDD0SWyziTOK+VswRuL+F511oSgCUaNkxt1oqwuyqTm0sQL7LkuIThkWDDiKofoKgBvWi0eS0Yijrw7pG2VArvmxpFWK+xUqk0Nv5dGn5GbbZZqdYMy8eamJaHQXkU4b5BYiijIxUWnF5J+Kfqi7Z3cfAMxpEzBYKqcg-TUIKENeQcStzuByKp8kmjFAqCoDkvY8gWvYFAKAqafl4MBf0wdpy7IRgKJGH6fJkVdD5Oe4wt4G6+1vcy9uFVk2No4cNdwG5XFWLVvGgl+sU0eAQ7wJDnDuF9qpQO7xL10ZwMKFUCFR1qnTrqGEm8-Ya0-Vds7PlJKxjYdw5I6xPxY6irsRKhxGG4PscQ5YqRAjKVyKIzSkj0lnxexuDeDoIbjHaIch8tpImcNif2QAw5eTs2ybssYJsuIygtBuGUcQyg-TGBvE-S5KI+b8g0+srDonkM8J6e+nd8hDBVJDGoO4bQ-E4j8m9cGwj1wQBimAaQkRtSYB+HG-FgjO1DGi7F+LiWfgEak4wXz-oShck0iIcMYbMRaCqTcJoeIEQug0n5DQsSIAxbiwlpL3HeNtoEx2-WmX2s5by9S1GRnd3Fb0J2N8FXaIiCqZxTkTyLhdHkkxZpEaMutbGPmA8AlsAcbGKhXBqHUuJv61tjwO3lx7YOx4I7w3pOjYdvCTKvkcTXsjD6rseqbjkTfsFCzRQWMbbsNF7bu2wD7Y81AI7XXbHisldKyqYPLsQ6h9pu7EAHsFcM89xACIbwYI+z+gMVTfz5tdgYPIOVPUU1gA4Rct2jR6mzOaUa41JpYTiI64jePRRP3dbRE1Qp1E0edE-HyhUsTUMFPJLi8peDsB3PAFIENeejwQOgXsfp0AKHoyGkmLcSboIbhTLuHhvDq7AeIdqI43s3IaDlKMbEzfb0+NTMAVvWqsQKAe04vY2KOTmyKfIsKG6Sh6LKYobRXeklVOqGceoveXjbqpTShQQxYlohtcN9aJxx6TAnkC6ZzfM9NCrp7GuFCIjqGtX9jdOilMabHw0lBgJpjnIuFca5cNZyVgeZP0kcRojYgFZuBwoXdlDc2O8JSG5lFzzBgy3VB+OwuH94tqITD8jaNtdPe1WLXyqDtCmZ0OF01XzkYMZEKLyQjzROif1nfonWlvsrzd0F0+prTK6l+-NKGbAW2fjel7EzyFiFFUAFEqCCgDDHwYTz1Tl7gzj7yjmXD-3qC3y5GuRKE9SqDuS9gchHzKXC1chNxb0TB7hpj7kk0PnQPyDfEvgvRMHxCvWD1r0yiaFaElFYjKEUG4KwWQBwXQIgRsz+j3TAyKhgNcmMEi0qk-mXD4lUHYG4ToJRF8goXxEgIbmU1gNuHfhB3xRwVUAACM4ldYcM6CHIYU-IJCOg8Qhxr9WM5VJF0CbcQ9nZFtqFJ5eDV460l8MtWk3M8NWA-k6C8ZnQegfJfZAw24ItzUDDVlNMPBm0dk0kMlXCa9EAmJyJgD8gSg-Jt8-ChNu0xghV0Cco1AHItAAkAwPVRC6gzMzhA18QDhZkY8DDLUKDUB0D8QmwLMl4ugKhXl2U3VmjMQ8DTB2iECRFhNki01PcZM+dXImg7MUE2hJQyhMirxzl3IQDOIBwAkV0dY11VCxd7ITMJDPwb1n4MQH0n0X1BFyj0Fmhn4lAMRMQn52Rz03Ur0KhxB8pZDYMSj3MMdgj0CmkzhURUR-ZV5xA2CEE2htgF0okWh-Z5JXN4NocXDFiNcxQLlwVrkoV8C6hhYytbghj-Vm5XYWs2tssktLCzi+Q+CqFplspI9l0EiLsoArsbtocjtyiAYD1r9Q1URwj7IAxyIr0yIcYVBF99Z6dGdodaCcSXV2Q0RSt-iNVjBfVCiWTpcyoTd5czAgA */
  model.createMachine(
    {
      tsTypes: {} as import('./vcItem.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      on: {
        REFRESH: {
          target: '.checkingStore',
        },
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
            REVOKE_VC: {
              target: 'acceptingRevokeInput',
            },
            ADD_WALLET_BINDING_ID: {
              target: 'requestingBindingOtp',
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
              actions: 'updateVc',
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
                actions: log((_, event) => (event.data as Error).message),
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
              actions: 'setOtp',
              target: 'requestingLock',
            },
            DISMISS: {
              target: 'idle',
            },
          },
        },
        requestingOtp: {
          invoke: {
            src: 'requestOtp',
            onDone: [
              {
                actions: [log('accepting OTP')],
                target: 'acceptingOtpInput',
              },
            ],
            onError: [
              {
                actions: [log('error OTP')],
                target: '#vc-item.invalid.backend',
              },
            ],
          },
        },
        acceptingOtpInput: {
          entry: ['clearOtp', 'setTransactionId'],
          on: {
            INPUT_OTP: [
              {
                actions: [
                  log('setting OTP lock'),
                  'setTransactionId',
                  'setOtp',
                ],
                target: 'requestingLock',
              },
            ],
            DISMISS: {
              actions: ['clearOtp', 'clearTransactionId'],
              target: 'idle',
            },
          },
        },
        acceptingRevokeInput: {
          entry: [log('acceptingRevokeInput'), 'clearOtp', 'setTransactionId'],
          on: {
            INPUT_OTP: [
              {
                actions: [
                  log('setting OTP revoke'),
                  'setTransactionId',
                  'setOtp',
                ],
                target: 'requestingRevoke',
              },
            ],
            DISMISS: {
              actions: ['clearOtp', 'clearTransactionId'],
              target: 'idle',
            },
          },
        },
        requestingLock: {
          invoke: {
            src: 'requestLock',
            onDone: [
              {
                actions: 'setLock',
                target: 'lockingVc',
              },
            ],
            onError: [
              {
                actions: 'setOtpError',
                target: 'acceptingOtpInput',
              },
            ],
          },
        },
        lockingVc: {
          entry: ['storeLock'],
          on: {
            STORE_RESPONSE: {
              target: 'idle',
            },
          },
        },
        requestingRevoke: {
          invoke: {
            src: 'requestRevoke',
            onDone: [
              {
                actions: [log('doneRevoking'), 'setRevoke'],
                target: 'revokingVc',
              },
            ],
            onError: [
              {
                actions: [
                  log((_, event) => (event.data as Error).message),
                  'setOtpError',
                ],
                target: 'acceptingOtpInput',
              },
            ],
          },
        },
        revokingVc: {
          entry: ['revokeVID'],
          on: {
            STORE_RESPONSE: {
              target: 'loggingRevoke',
            },
          },
        },
        loggingRevoke: {
          entry: [log('loggingRevoke'), 'logRevoked'],
          on: {
            DISMISS: {
              target: 'idle',
            },
          },
        },
        requestingBindingOtp: {
          invoke: {
            src: 'requestBindingOtp',
            onDone: [
              {
                target: 'acceptingBindingOtp',
                actions: log('accepting OTP'),
              },
            ],
            onError: [
              {
                target: '#vc-item.invalid.backend',
                actions: log((_, event) => (event.data as Error).message),
              },
            ],
          },
        },
        acceptingBindingOtp: {
          entry: ['clearOtp', 'setTransactionId'],
          on: {
            INPUT_OTP: {
              target: 'addKeyPair',
              actions: [
                log('calling addKeyPair'),
                'setTransactionId',
                'setOtp',
              ],
            },
            DISMISS: {
              target: 'idle',
              actions: ['clearOtp', 'clearTransactionId'],
            },
          },
        },
        addKeyPair: {
          invoke: {
            src: 'generateKeyPair',
            onDone: {
              target: 'addingWalletBindingId',
              actions: ['setPublicKey'],
            },
            onError: [
              {
                target: 'idle',
                actions: 'setWalletBindingError',
              },
            ],
          },
        },
        addingWalletBindingId: {
          invoke: {
            src: 'addWalletBindnigId',
            onDone: [
              {
                target: 'showBindingStatus',
                actions: [
                  'setWalletBindingId',
                  'storeContext',
                  log(
                    (_context, event) =>
                      'Received walletBindingId : ' + _context.walletBindingId
                  ),
                ],
              },
            ],
            onError: [
              {
                target: 'idle',
                actions: 'setWalletBindingError',
              },
            ],
          },
        },
        // storePrivateKey: {
        //   invoke: {
        //     src: 'storePrivateKeyToKeystore',
        //     onDone: {
        //       target: 'showBindingStatus',
        //     },
        //     onError: {
        //       actions: 'setWalletBindingError',
        //         target: 'showBindingStatus',
        //     },
        //   }

        // },
        showBindingStatus: {
          on: {
            BINDING_DONE: {
              target: 'idle',
            },
          },
        },
      },
    },
    {
      actions: {
        setWalletBindingError: assign({
          walletBindingError: (context, event) => (event.data as Error).message,
        }),

        setPublicKey: assign({
          publicKey: (context, event) => (event.data as KeyPair).public,
        }),

        setWalletBindingId: assign({
          walletBindingId: (context, event) => event.data as string,
        }),

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

        logRevoked: send(
          (context) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: VC_ITEM_STORE_KEY(context),
              action: 'revoked',
              timestamp: Date.now(),
              deviceName: '',
              vcLabel: context.tag || context.id,
            }),
          {
            to: (context) => context.serviceRefs.activityLog,
          }
        ),

        revokeVID: send(
          (context) => {
            return StoreEvents.REMOVE(
              MY_VCS_STORE_KEY,
              VC_ITEM_STORE_KEY(context)
            );
          },
          {
            to: (context) => context.serviceRefs.store,
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

        setRevoke: assign({
          revoked: () => true,
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
        addWalletBindnigId: async (context) => {
          let response = null;
          try {
            response = await request('POST', '/binding-credential-request', {
              individualId: context.id,
              otp: context.otp,
              transactionID: context.transactionId,
              publicKey: context.publicKey,
            });
          } catch (error) {
            console.error(error);
          }
          return response.response.id;
        },

        generateKeyPair: async (context) => {
          let keyPair: KeyPair = await generateKeys();

          const hasSetPrivateKey: boolean = await savePrivateKey(
            context.verifiableCredential.id,
            keyPair.private
          );

          if (!hasSetPrivateKey) {
            throw new Error('Could not store private key in keystore.');
          }

          return keyPair;
        },

        requestBindingOtp: async (context) => {
          try {
            return request('POST', '/binding-otp', {
              individualId: context.id,
              individualIdType: context.idType,
              otpChannel: ['EMAIL', 'PHONE'],
              transactionID: context.transactionId,
            });
          } catch (error) {
            console.error(error);
          }
        },

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
                  walletBindingId: context.walletBindingId,
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

        requestRevoke: async (context) => {
          try {
            return request('PATCH', `/vid/${context.id}`, {
              transactionID: context.transactionId,
              vidStatus: 'REVOKED',
              individualId: context.id,
              individualIdType: 'VID',
              otp: context.otp,
            });
          } catch (error) {
            console.error(error);
          }
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

export function selectContext(state: State) {
  return state.context;
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

export function selectIsRevokingVc(state: State) {
  return state.matches('revokingVc');
}

export function selectIsLoggingRevoke(state: State) {
  return state.matches('loggingRevoke');
}

export function selectIsAcceptingOtpInput(state: State) {
  return state.matches('acceptingOtpInput');
}

export function selectIsAcceptingRevokeInput(state: State) {
  return state.matches('acceptingRevokeInput');
}

export function selectIsRequestingOtp(state: State) {
  return state.matches('requestingOtp');
}

export function selectIsRequestBindingOtp(state: State) {
  return state.matches('requestingBindingOtp');
}

export function selectWalletBindingId(state: State) {
  return state.context.walletBindingId;
}

export function selectEmptyWalletBindingId(state: State) {
  var val = state.context.walletBindingId;
  return val === undefined || val == null || val.length <= 0 ? true : false;
}

export function selectWalletBindingError(state: State) {
  return state.context.walletBindingError;
}

export function selectAcceptingBindingOtp(state: State) {
  return state.matches('acceptingBindingOtp');
}

export function selectShowBindingStatus(state: State) {
  return state.matches('showBindingStatus');
}
