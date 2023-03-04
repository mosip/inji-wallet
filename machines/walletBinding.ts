import { TextInput } from 'react-native';
import { assign, ErrorPlatformEvent, StateFrom, send, EventFrom } from 'xstate';
import { log } from 'xstate/lib/actions';

import i18n from '../i18n';
import { AppServices } from '../shared/GlobalContext';
import { ActivityLogEvents } from './activityLog';
import { StoreEvents } from './store';
import { createModel } from 'xstate/lib/model';
import { request } from '../shared/request';
import { VcIdType } from '../types/vc';
import { MY_VCS_STORE_KEY, VC_ITEM_STORE_KEY } from '../shared/constants';
import {
  generateKeys,
  WalletBindingResponse,
} from '../shared/cryptoutil/cryptoUtil';
import { KeyPair } from 'react-native-rsa-native';
import {
  getBindingCertificateConstant,
  savePrivateKey,
} from '../shared/keystore/SecureKeystore';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    idType: 'VID' as VcIdType,
    id: '',
    idError: '',
    otp: '',
    otpError: '',
    transactionId: '',
    requestId: '',
    VIDs: [] as string[],
    bindingTransactionId: '',
    walletBindingResponse: null as WalletBindingResponse,
    walletBindingError: '',
    publicKey: '',
    privateKey: '',
  },
  {
    events: {
      INPUT_OTP: (otp: string) => ({ otp }),
      VALIDATE_INPUT: () => ({}),
      READY: (idInputRef: TextInput) => ({ idInputRef }),
      DISMISS: () => ({}),
      SELECT_ID_TYPE: (idType: VcIdType) => ({ idType }),
      REVOKE_VCS: (vcKeys: string[]) => ({ vcKeys }),
      STORE_RESPONSE: (response: string[]) => ({ response }),
      ERROR: (data: Error) => ({ data }),
      SUCCESS: () => ({}),
      CONFIRM: () => ({}),
      CANCEL: () => ({}),
    },
  }
);

export const walletBindingMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCUwDcD2BrMA1AlhLAHSEA2YAxMgKK4DyA0jQPq4DCAyoqAA4ax8AF3wYAdjxAAPRACYAHAFZiARhUB2WQDZFABgCcO-boDMWgDQgAnohWyALLOK6X9k-J3zZirfYC+fpaomDgERKRiaACGZISUAJIAcgAKAKoAKiz06cmS-IIi4pIyCOq6TuomjvYqWlpe3iaWNgiKik4u5fK69vr2uipmAUHo2HiEJPiRMXEAIvGcALIL3Egg+cKiEmslZRVVDrX1so3Nclr6zi61pvLyKoY9wyDBY2EkUQDGn2C8ImJQXDxWaTCAUah0JisDirPgCTZFHaIEyydTEe6yEyaQzqXrtM4IeQmXRXcrqDz9dQPEzPV6hCbEL4-P5TQHAkgAJzAAEcAK5wf5QehCXiUCDiMAREKSunjcJM36CoEg4hcvkC1nC3gIKaYT5RQpiADaugAunl4Ybioh8dZbHtiHoevpFESlIp9DTAi9RvT5d9FazlZyefzYIKtZQwByORgOcReGQDQAzOMAW2IsvejIDLIBwdVoY1AK1OsiGH1hpN5rWGytSIQJix6LsWNkOLxsgJKLRnVMlXJdxq-m9WYZCrzbJBlHmSxWFoKW2tjdRLcx2K0uJdXbtCGMpN03Qe-X03VktN9co+uYjIviYl4vKECRSGSyOQXCO2oBKKkPaNdRQqXsRRBi0EwXQJep5EdFxURdTczB0C9pWzCdb14e9H2fWdlk4WF1ktJcGwUZQ1E0HQDCMUwLF3NQ+lJVFN3kXFvBQt4GTVMNBVlMUJSlMZM0vbMuOLKBZTLPUDS2atP3rH9bH-R0lGA0CzAgxQCRqS4nQ0F0-10SoRxGVDOKLcNWV46NY3jRMU3TITTPCUSLIBCTdQraTxFk2siMRBTSh3FpBhdWCeiAqkiSA4yfSckMQiDT4ZwWPCCLrYiAq8AlBgeYg6jKLF1DaB5ygCb0xAwCA4EkMdwnIMA5Iy6RbEMPKNGJSo2nuD17Gyh5lDqC59HUTwVBqL0TI4urpliCBiAwEVGv85rWipZx5GGxRiV8GjNN3BQALg8bMS0citHYv1JhmwhiAAIy+HAxAgJbvxWto0T6doTlkFwtBOFRuzaMK1G6TdqWGi6rylGZnt8xdlpKLaTGIT7vp+3Q-tkAH9pUZRdNOux9KxGLauvZklXZUgwQauGv2XH7LhMOwai+zcfvkXrd3sHQwsPal7C8WpFEhtCbyDSmXIwl7l00btud5twLj-Op5BF8cxfzdlpYbAXspYhW9iG3w1f9cnNTvB8n21gKBbROpHEAhn20UTngp+lRiCx7nN1uAxMRNkN1Vc8TL2tlaiTRQZtBMCKBe+gkXZJJ1tB6ECBf0FQA8LBL80+MPf3bGC7lRDHT1TptuzuMLDhRMwzoD-O5Fd2wYOuVF-raXx7HUMq-CAA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./WalletBinding.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      id: 'walletBinding',
      initial: 'showBindingWarning',
      states: {
        showBindingWarning: {
          on: {
            CONFIRM: {
              target: 'requestingBindingOtp',
            },
            CANCEL: {
              target: 'showBindingWarning',
            },
          },
        },
        requestingBindingOtp: {
          invoke: {
            src: 'requestBindingOtp',
            onDone: [
              {
                target: 'acceptingBindingOtp',
              },
            ],
            onError: [
              {
                actions: 'setWalletBindingError',
                target: 'showingWalletBindingError',
              },
            ],
          },
        },
        showingWalletBindingError: {
          on: {
            CANCEL: {
              target: 'showBindingWarning',
              actions: 'setWalletBindingErrorEmpty',
            },
          },
        },
        acceptingBindingOtp: {
          entry: ['clearOtp'],
          on: {
            INPUT_OTP: {
              target: 'addKeyPair',
              actions: ['setOtp'],
            },
            DISMISS: {
              target: '',
              actions: ['clearOtp', 'clearTransactionId'],
            },
          },
        },
        addKeyPair: {
          invoke: {
            src: 'generateKeyPair',
            onDone: {
              target: 'addingWalletBindingId',
              actions: ['setPublicKey', 'setPrivateKey'],
            },
            onError: [
              {
                actions: 'setWalletBindingError',
                target: 'showingWalletBindingError',
              },
            ],
          },
        },
        addingWalletBindingId: {
          invoke: {
            src: 'addWalletBindnigId',
            onDone: [
              {
                target: 'updatingPrivateKey',
                actions: ['setWalletBindingId'],
              },
            ],
            onError: [
              {
                actions: 'setWalletBindingError',
                target: 'showingWalletBindingError',
              },
            ],
          },
        },
        updatingPrivateKey: {
          invoke: {
            src: 'updatePrivateKey',
            onDone: {
              target: '',
              actions: [
                'storeContext',
                'updatePrivateKey',
                'updateVc',
                'setWalletBindingErrorEmpty',
              ],
            },
            onError: {
              actions: 'setWalletBindingError',
              target: 'showingWalletBindingError',
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

        setWalletBindingErrorEmpty: assign({
          walletBindingError: () => '',
        }),

        setPublicKey: assign({
          publicKey: (context, event) => (event.data as KeyPair).public,
        }),

        setPrivateKey: assign({
          privateKey: (context, event) => (event.data as KeyPair).private,
        }),

        updatePrivateKey: assign({
          privateKey: () => '',
        }),

        setWalletBindingId: assign({
          walletBindingResponse: (context, event) =>
            event.data as WalletBindingResponse,
        }),

        setOtp: model.assign({
          otp: (_context, event) => event.otp,
        }),

        clearOtp: assign({ otp: '' }),

        storeContext: send(
          (context) => {
            const { serviceRefs, ...data } = context;
            return StoreEvents.SET(VC_ITEM_STORE_KEY(context), data);
          },
          {
            to: (context) => context.serviceRefs.store,
          }
        ),

        updateVc: send(
          (context) => {
            const { serviceRefs, ...vc } = context;
            return { type: 'VC_DOWNLOADED', vc };
          },
          {
            to: (context) => context.serviceRefs.vc,
          }
        ),
      },

      services: {
        addWalletBindnigId: async (context) => {
          const response = await request(
            'POST',
            '/residentmobileapp/wallet-binding',
            {
              requestTime: String(new Date().toISOString()),
              request: {
                authFactorType: 'WLA',
                format: 'jwt',
                individualId: context.id,
                transactionId: context.bindingTransactionId,
                publicKey: context.publicKey,
                challengeList: [
                  {
                    authFactorType: 'OTP',
                    challenge: context.otp,
                    format: 'alpha-numeric',
                  },
                ],
              },
            }
          );
          const certificate = response.response.certificate;
          await savePrivateKey(
            getBindingCertificateConstant(context.id),
            certificate
          );

          const walletResponse: WalletBindingResponse = {
            walletBindingId: response.response.encryptedWalletBindingId,
            keyId: response.response.keyId,
            thumbprint: response.response.thumbprint,
            expireDateTime: response.response.expireDateTime,
          };
          return walletResponse;
        },

        updatePrivateKey: async (context) => {
          const hasSetPrivateKey: boolean = await savePrivateKey(
            context.walletBindingResponse.walletBindingId,
            context.privateKey
          );
          if (!hasSetPrivateKey) {
            throw new Error('Could not store private key in keystore.');
          }
          return '';
        },

        generateKeyPair: async (context) => {
          let keyPair: KeyPair = await generateKeys();
          return keyPair;
        },

        requestBindingOtp: async (context) => {
          console.log('requesting otp');
          const response = await request(
            'POST',
            '/residentmobileapp/binding-otp',
            {
              requestTime: String(new Date().toISOString()),
              request: {
                individualId: context.id,
                otpChannels: ['EMAIL', 'PHONE'],
              },
            }
          );
          if (response.response == null) {
            throw new Error('Could not process request');
          }
        },
      },

      guards: {},
    }
  );

export function createWalletBindingMachine(serviceRefs: AppServices) {
  return walletBindingMachine.withContext({
    ...walletBindingMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof walletBindingMachine>;

export const WalletBindingEvents = model.events;

export function selectIdType(state: State) {
  return state.context.idType;
}

export function selectIdError(state: State) {
  return state.context.idError;
}

export function selectOtpError(state: State) {
  return state.context.otpError;
}
export function selectWalletBindingError(state: State) {
  return state.context.walletBindingError;
}
export function selectIsBindingWarning(state: State) {
  return state.matches('showBindingWarning');
}

export function selectIsAcceptingOtpInput(state: State) {
  return state.matches('acceptingBindingOtp');
}

export function walletBindingInProgress(state: State) {
  return state.matches('requestingBindingOtp') ||
    state.matches('addingWalletBindingId') ||
    state.matches('addKeyPair') ||
    state.matches('updatingPrivateKey')
    ? true
    : false;
}

export function selectShowWalletBindingError(state: State) {
  return state.matches('showingWalletBindingError');
}
