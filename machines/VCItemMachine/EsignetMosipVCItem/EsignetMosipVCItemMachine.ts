import {assign, ErrorPlatformEvent, EventFrom, send, StateFrom} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../../shared/GlobalContext';
import {VCMetadata} from '../../../shared/VCMetadata';
import {VC} from '../../../types/VC/ExistingMosipVC/vc';
import {
  generateKeys,
  isCustomKeystore,
  WalletBindingResponse,
} from '../../../shared/cryptoutil/cryptoUtil';
import {log} from 'xstate/lib/actions';
import {Protocols} from '../../../shared/openId4VCI/Utils';
import {StoreEvents} from '../../../machines/store';
import {MIMOTO_BASE_URL, MY_VCS_STORE_KEY} from '../../../shared/constants';
import {VcEvents} from '../../../machines/vc';
import i18n from '../../../i18n';
import {KeyPair} from 'react-native-rsa-native';
import {
  getBindingCertificateConstant,
  savePrivateKey,
} from '../../../shared/keystore/SecureKeystore';
import {ActivityLogEvents} from '../../../machines/activityLog';
import {request} from '../../../shared/request';
import SecureKeystore from 'react-native-secure-keystore';
import {VerifiableCredential} from './vc';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    vcMetadata: {} as VCMetadata,
    generatedOn: new Date() as Date,
    verifiableCredential: null as VerifiableCredential,
    isPinned: false,
    hashedId: '',

    publicKey: '',
    privateKey: '',

    otp: '',
    otpError: '',
    idError: '',
    transactionId: '',
    bindingTransactionId: '',
    walletBindingResponse: null as WalletBindingResponse,
    walletBindingError: '',
    walletBindingSuccess: false,
  },
  {
    events: {
      KEY_RECEIVED: (key: string) => ({key}),
      KEY_ERROR: (error: Error) => ({error}),
      STORE_READY: () => ({}),
      DISMISS: () => ({}),
      CREDENTIAL_DOWNLOADED: (vc: VC) => ({vc}),
      STORE_RESPONSE: (response: VC) => ({response}),
      POLL: () => ({}),
      DOWNLOAD_READY: () => ({}),
      GET_VC_RESPONSE: (vc: VC) => ({vc}),
      VERIFY: () => ({}),
      LOCK_VC: () => ({}),
      RESEND_OTP: () => ({}),
      INPUT_OTP: (otp: string) => ({otp}),
      REFRESH: () => ({}),
      REVOKE_VC: () => ({}),
      ADD_WALLET_BINDING_ID: () => ({}),
      CANCEL: () => ({}),
      CONFIRM: () => ({}),
      STORE_ERROR: (error: Error) => ({error}),
      PIN_CARD: () => ({}),
      KEBAB_POPUP: () => ({}),
      SHOW_ACTIVITY: () => ({}),
      REMOVE: (vcMetadata: VCMetadata) => ({vcMetadata}),
      UPDATE_VC_METADATA: (vcMetadata: VCMetadata) => ({vcMetadata}),
    },
  },
);

export const EsignetMosipVCItemEvents = model.events;

export const EsignetMosipVCItemMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./EsignetMosipVCItemMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    on: {
      REFRESH: {
        target: '.checkingStore',
      },
      UPDATE_VC_METADATA: {
        actions: 'setVcMetadata',
      },
    },
    description: 'VC',
    id: 'vc-item-openid4vci',
    initial: 'checkingVc',
    states: {
      checkingVc: {
        entry: ['requestVcContext'],
        description: 'Fetch the VC data from the Memory.',
        on: {
          GET_VC_RESPONSE: [
            {
              actions: [
                'setVerifiableCredential',
                'setContext',
                'setGeneratedOn',
              ],
              cond: 'hasCredential',
              target: 'idle',
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
          STORE_RESPONSE: {
            actions: ['setVerifiableCredential', 'setContext', 'updateVc'],
            target: 'idle',
          },
        },
      },
      showBindingWarning: {
        on: {
          CONFIRM: {
            target: 'requestingBindingOtp',
          },
          CANCEL: {
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
            },
          ],
          onError: [
            {
              actions: ['setWalletBindingError', 'logWalletBindingFailure'],
              target: 'showingWalletBindingError',
            },
          ],
        },
      },
      showingWalletBindingError: {
        on: {
          CANCEL: {
            target: 'idle',
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
            target: 'idle',
            actions: ['clearOtp', 'clearTransactionId'],
          },
          RESEND_OTP: {
            target: '.resendOTP',
          },
        },
        initial: 'idle',
        states: {
          idle: {},
          resendOTP: {
            invoke: {
              src: 'requestOtp',
              onDone: [
                {
                  target: 'idle',
                },
              ],
            },
          },
        },
      },
      addKeyPair: {
        invoke: {
          src: 'generateKeyPair',
          onDone: [
            {
              cond: 'isCustomSecureKeystore',
              target: 'addingWalletBindingId',
              actions: ['setPublicKey'],
            },
            {
              target: 'addingWalletBindingId',
              actions: ['setPublicKey', 'setPrivateKey'],
            },
          ],
          onError: [
            {
              actions: ['setWalletBindingError', 'logWalletBindingFailure'],
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
              cond: 'isCustomSecureKeystore',
              target: 'idle',
              actions: [
                'setWalletBindingId',
                'setThumbprintForWalletBindingId',
                'storeContext',
                'updateVc',
                'setWalletBindingErrorEmpty',
                'logWalletBindingSuccess',
              ],
            },
            {
              target: 'updatingPrivateKey',
              actions: [
                'setWalletBindingId',
                'setThumbprintForWalletBindingId',
              ],
            },
          ],
          onError: [
            {
              actions: ['setWalletBindingError', 'logWalletBindingFailure'],
              target: 'showingWalletBindingError',
            },
          ],
        },
      },
      updatingPrivateKey: {
        invoke: {
          src: 'updatePrivateKey',
          onDone: {
            actions: [
              'storeContext',
              'updatePrivateKey',
              'updateVc',
              'setWalletBindingErrorEmpty',
              'setWalletBindingSuccess',
              'logWalletBindingSuccess',
            ],
            target: 'idle',
          },
          onError: {
            actions: ['setWalletBindingError', 'logWalletBindingFailure'],
            target: 'showingWalletBindingError',
          },
        },
      },
      idle: {
        on: {
          DISMISS: {
            target: 'checkingVc',
            actions: 'resetWalletBindingSuccess',
          },
          KEBAB_POPUP: {
            target: 'kebabPopUp',
          },
          ADD_WALLET_BINDING_ID: {
            target: 'showBindingWarning',
          },
          PIN_CARD: {
            target: 'pinCard',
            actions: 'setPinCard',
          },
        },
      },
      pinCard: {
        entry: 'storeContext',
        on: {
          STORE_RESPONSE: {
            actions: ['sendVcUpdated', 'VcUpdated'],
            target: 'idle',
          },
        },
      },
      kebabPopUp: {
        on: {
          DISMISS: {
            target: 'idle',
          },
          ADD_WALLET_BINDING_ID: {
            target: '#vc-item-openid4vci.kebabPopUp.showBindingWarning',
          },
          PIN_CARD: {
            target: '#vc-item-openid4vci.pinCard',
            actions: 'setPinCard',
          },
          SHOW_ACTIVITY: {
            target: '#vc-item-openid4vci.kebabPopUp.showActivities',
          },
          REMOVE: {
            actions: 'setVcKey',
            target: '#vc-item-openid4vci.kebabPopUp.removeWallet',
          },
        },
        initial: 'idle',
        states: {
          idle: {},
          showBindingWarning: {
            on: {
              CONFIRM: {
                target: '#vc-item-openid4vci.kebabPopUp.requestingBindingOtp',
              },
              CANCEL: {
                target: '#vc-item-openid4vci.kebabPopUp',
              },
            },
          },
          requestingBindingOtp: {
            invoke: {
              src: 'requestBindingOtp',
              onDone: [
                {
                  target: '#vc-item-openid4vci.kebabPopUp.acceptingBindingOtp',
                  actions: [log('accceptingOTP')],
                },
              ],
              onError: [
                {
                  actions: 'setWalletBindingError',
                  target:
                    '#vc-item-openid4vci.kebabPopUp.showingWalletBindingError',
                },
              ],
            },
          },
          showingWalletBindingError: {
            on: {
              CANCEL: {
                target: '#vc-item-openid4vci.kebabPopUp',
                actions: 'setWalletBindingErrorEmpty',
              },
            },
          },
          acceptingBindingOtp: {
            entry: ['clearOtp'],
            on: {
              INPUT_OTP: {
                target: '#vc-item-openid4vci.kebabPopUp.addKeyPair',
                actions: ['setOtp'],
              },
              DISMISS: {
                target: '#vc-item-openid4vci.kebabPopUp',
                actions: ['clearOtp', 'clearTransactionId'],
              },
              RESEND_OTP: {
                target: '.resendOTP',
              },
            },
            initial: 'idle',
            states: {
              idle: {},
              resendOTP: {
                invoke: {
                  src: 'requestOtp',
                  onDone: [
                    {
                      target: 'idle',
                    },
                  ],
                },
              },
            },
          },
          addKeyPair: {
            invoke: {
              src: 'generateKeyPair',
              onDone: [
                {
                  cond: 'isCustomSecureKeystore',
                  target:
                    '#vc-item-openid4vci.kebabPopUp.addingWalletBindingId',
                  actions: ['setPublicKey'],
                },
                {
                  target:
                    '#vc-item-openid4vci.kebabPopUp.addingWalletBindingId',
                  actions: ['setPublicKey', 'setPrivateKey'],
                },
              ],
              onError: [
                {
                  actions: 'setWalletBindingError',
                  target:
                    '#vc-item-openid4vci.kebabPopUp.showingWalletBindingError',
                },
              ],
            },
          },
          addingWalletBindingId: {
            invoke: {
              src: 'addWalletBindnigId',
              onDone: [
                {
                  cond: 'isCustomSecureKeystore',
                  target: '#vc-item-openid4vci.kebabPopUp',
                  actions: [
                    'setWalletBindingId',
                    'setThumbprintForWalletBindingId',
                    'storeContext',
                    'updateVc',
                    'setWalletBindingErrorEmpty',
                    'sendWalletBindingSuccess',
                    'logWalletBindingSuccess',
                  ],
                },
                {
                  target: '#vc-item-openid4vci.kebabPopUp.updatingPrivateKey',
                  actions: [
                    'setWalletBindingId',
                    'setThumbprintForWalletBindingId',
                  ],
                },
              ],
              onError: [
                {
                  actions: ['setWalletBindingError', 'logWalletBindingFailure'],
                  target:
                    '#vc-item-openid4vci.kebabPopUp.showingWalletBindingError',
                },
              ],
            },
          },
          updatingPrivateKey: {
            invoke: {
              src: 'updatePrivateKey',
              onDone: {
                actions: [
                  'storeContext',
                  'updatePrivateKey',
                  'updateVc',
                  'setWalletBindingErrorEmpty',
                  'sendWalletBindingSuccess',
                  'logWalletBindingSuccess',
                ],
                target: '#vc-item-openid4vci.kebabPopUp',
              },
              onError: {
                actions: 'setWalletBindingError',
                target:
                  '#vc-item-openid4vci.kebabPopUp.showingWalletBindingError',
              },
            },
          },
          showActivities: {
            on: {
              DISMISS: '#vc-item-openid4vci.kebabPopUp',
            },
          },
          removeWallet: {
            on: {
              CONFIRM: {
                target: 'removingVc',
              },
              CANCEL: {
                target: 'idle',
              },
            },
          },
          removingVc: {
            entry: 'removeVcItem',
            on: {
              STORE_RESPONSE: {
                actions: ['removedVc', 'logVCremoved'],
                target: '#vc-item-openid4vci',
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      setVcMetadata: assign({
        vcMetadata: (_, event) => event.vcMetadata,
      }),

      requestVcContext: send(
        context => ({
          type: 'GET_VC_ITEM',
          vcMetadata: context.vcMetadata,
          protocol: Protocols.OpenId4VCI,
        }),
        {
          to: context => context.serviceRefs.vc,
        },
      ),
      requestStoredContext: send(
        context => {
          return StoreEvents.GET(
            VCMetadata.fromVC(context.vcMetadata).getVcKey(),
          );
        },
        {
          to: context => context.serviceRefs.store,
        },
      ),
      updateVc: send(
        context => {
          const {serviceRefs, ...verifiableCredential} = context;
          return {
            type: 'VC_DOWNLOADED_FROM_OPENID4VCI',
            vc: verifiableCredential,
            vcMetadata: context.vcMetadata,
          };
        },
        {
          to: context => context.serviceRefs.vc,
        },
      ),

      setVerifiableCredential: model.assign({
        verifiableCredential: (_, event) => {
          if (event.type === 'GET_VC_RESPONSE') {
            return event.vc.verifiableCredential
              ? event.vc.verifiableCredential
              : event.vc;
          }
          return event.response.verifiableCredential;
        },
      }),

      setContext: model.assign((context, event) => {
        if (event.type === 'STORE_RESPONSE') {
          const {verifiableCredential, ...data} = event.response;
          return {...context, ...data};
        }
        if (event.type === 'GET_VC_RESPONSE') {
          const {verifiableCredential, ...data} = event.vc;
          return {...context, ...data};
        }
        return context;
      }),

      setGeneratedOn: model.assign({
        generatedOn: (_context, event) => {
          if (event.type === 'GET_VC_RESPONSE') {
            return event.vc.generatedOn;
          }
          return event.response.generatedOn;
        },
      }),

      storeContext: send(
        context => {
          const {serviceRefs, ...data} = context;
          data.credentialRegistry = MIMOTO_BASE_URL;
          return StoreEvents.SET(
            VCMetadata.fromVC(context.vcMetadata).getVcKey(),
            data,
          );
        },
        {
          to: context => context.serviceRefs.store,
        },
      ),
      setPinCard: assign(context => {
        return {
          ...context,
          isPinned: !context.isPinned,
        };
      }),
      VcUpdated: send(
        context => {
          const {serviceRefs, ...vc} = context;
          return {type: 'VC_UPDATE', vc};
        },
        {
          to: context => context.serviceRefs.vc,
        },
      ),

      sendVcUpdated: send(
        context =>
          VcEvents.VC_METADATA_UPDATED(
            new VCMetadata({...context.vcMetadata, isPinned: context.isPinned}),
          ),
        {
          to: context => context.serviceRefs.vc,
        },
      ),

      setWalletBindingError: assign({
        walletBindingError: (context, event) =>
          i18n.t(`errors.genericError`, {
            ns: 'common',
          }),
      }),

      setWalletBindingErrorEmpty: assign({
        walletBindingError: () => '',
      }),

      setWalletBindingSuccess: assign({
        walletBindingSuccess: true,
      }),

      resetWalletBindingSuccess: assign({
        walletBindingSuccess: false,
      }),

      sendWalletBindingSuccess: send(
        context => {
          return {
            type: 'WALLET_BINDING_SUCCESS',
          };
        },
        {
          to: context => context.serviceRefs.vc,
        },
      ),
      setPublicKey: assign({
        publicKey: (context, event) => {
          if (!isCustomKeystore) {
            return (event.data as KeyPair).public;
          }
          return event.data as string;
        },
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
      setThumbprintForWalletBindingId: send(
        context => {
          const {walletBindingResponse} = context;
          const walletBindingIdKey = getBindingCertificateConstant(
            walletBindingResponse.walletBindingId,
          );
          return StoreEvents.SET(
            walletBindingIdKey,
            walletBindingResponse.thumbprint,
          );
        },
        {
          to: context => context.serviceRefs.store,
        },
      ),

      removedVc: send(
        () => ({
          type: 'REFRESH_MY_VCS',
        }),
        {
          to: context => context.serviceRefs.vc,
        },
      ),
      logWalletBindingSuccess: send(
        context =>
          ActivityLogEvents.LOG_ACTIVITY({
            _vcKey: VCMetadata.fromVC(context.vcMetadata).getVcKey(),
            type: 'WALLET_BINDING_SUCCESSFULL',
            timestamp: Date.now(),
            deviceName: '',
            vcLabel: VCMetadata.fromVC(context.vcMetadata).id,
          }),
        {
          to: context => context.serviceRefs.activityLog,
        },
      ),

      logWalletBindingFailure: send(
        context =>
          ActivityLogEvents.LOG_ACTIVITY({
            _vcKey: VCMetadata.fromVC(context.vcMetadata).getVcKey(),
            type: 'WALLET_BINDING_FAILURE',
            timestamp: Date.now(),
            deviceName: '',
            vcLabel: VCMetadata.fromVC(context.vcMetadata).id,
          }),
        {
          to: context => context.serviceRefs.activityLog,
        },
      ),
      setOtp: model.assign({
        otp: (_, event) => event.otp,
      }),

      setOtpError: assign({
        otpError: (_context, event) =>
          (event as ErrorPlatformEvent).data.message,
      }),

      clearOtp: assign({otp: ''}),
      removeVcItem: send(
        _context => {
          return StoreEvents.REMOVE(
            MY_VCS_STORE_KEY,
            _context.vcMetadata.getVcKey(),
          );
        },
        {to: context => context.serviceRefs.store},
      ),
      setVcKey: model.assign({
        vcMetadata: (_, event) => event.vcMetadata,
      }),
      logVCremoved: send(
        (context, _) =>
          ActivityLogEvents.LOG_ACTIVITY({
            _vcKey: VCMetadata.fromVC(context.vcMetadata).getVcKey(),
            type: 'VC_REMOVED',
            timestamp: Date.now(),
            deviceName: '',
            vcLabel: VCMetadata.fromVC(context.vcMetadata).id,
          }),
        {
          to: context => context.serviceRefs.activityLog,
        },
      ),
    },

    services: {
      updatePrivateKey: async context => {
        const hasSetPrivateKey: boolean = await savePrivateKey(
          context.walletBindingResponse.walletBindingId,
          context.privateKey,
        );
        if (!hasSetPrivateKey) {
          throw new Error('Could not store private key in keystore.');
        }
        return '';
      },
      addWalletBindnigId: async context => {
        const response = await request(
          'POST',
          '/residentmobileapp/wallet-binding',
          {
            requestTime: String(new Date().toISOString()),
            request: {
              authFactorType: 'WLA',
              format: 'jwt',
              individualId: VCMetadata.fromVC(context.vcMetadata).id,
              transactionId: context.transactionId,
              publicKey: context.publicKey,
              challengeList: [
                {
                  authFactorType: 'OTP',
                  challenge: context.otp,
                  format: 'alpha-numeric',
                },
              ],
            },
          },
        );
        const certificate = response.response.certificate;
        await savePrivateKey(
          getBindingCertificateConstant(
            VCMetadata.fromVC(context.vcMetadata).id,
          ),
          certificate,
        );

        const walletResponse: WalletBindingResponse = {
          walletBindingId: response.response.encryptedWalletBindingId,
          keyId: response.response.keyId,
          thumbprint: response.response.thumbprint,
          expireDateTime: response.response.expireDateTime,
        };
        return walletResponse;
      },
      generateKeyPair: async context => {
        if (!isCustomKeystore) {
          return await generateKeys();
        }
        const isBiometricsEnabled = SecureKeystore.hasBiometricsEnabled();
        return SecureKeystore.generateKeyPair(
          VCMetadata.fromVC(context.vcMetadata).id,
          isBiometricsEnabled,
          0,
        );
      },
      requestBindingOtp: async context => {
        const response = await request(
          'POST',
          '/residentmobileapp/binding-otp',
          {
            requestTime: String(new Date().toISOString()),
            request: {
              individualId: context.verifiableCredential.credential
                .credentialSubject.VID
                ? context.verifiableCredential.credential.credentialSubject.VID
                : context.verifiableCredential.credential.credentialSubject.UIN,
              otpChannels: ['EMAIL', 'PHONE'],
            },
          },
        );
        if (response.response == null) {
          throw new Error('Could not process request');
        }
      },
    },

    guards: {
      hasCredential: (_, event) => {
        const vc = event.vc;
        return vc != null;
      },

      isCustomSecureKeystore: () => isCustomKeystore,
    },
  },
);

export const createEsignetMosipVCItemMachine = (
  serviceRefs: AppServices,
  vcMetadata: VCMetadata,
) => {
  return EsignetMosipVCItemMachine.withContext({
    ...EsignetMosipVCItemMachine.context,
    serviceRefs,
    vcMetadata,
  });
};

type State = StateFrom<typeof EsignetMosipVCItemMachine>;

export function selectVerifiableCredentials(state: State) {
  return state.context.verifiableCredential;
}

export function selectKebabPopUp(state: State) {
  return state.matches('kebabPopUp');
}

export function selectContext(state: State) {
  return state.context;
}

export function selectGeneratedOn(state: State) {
  return state.context.generatedOn;
}

export function selectWalletBindingSuccess(state: State) {
  return state.context.walletBindingSuccess;
}

export function selectEmptyWalletBindingId(state: State) {
  var val = state.context.walletBindingResponse
    ? state.context.walletBindingResponse.walletBindingId
    : undefined;
  return val == undefined || val == null || val.length <= 0 ? true : false;
}

export function selectWalletBindingError(state: State) {
  return state.context.walletBindingError;
}

export function selectKebabPopUpAcceptingBindingOtp(state: State) {
  return state.matches('kebabPopUp.acceptingBindingOtp');
}

export function selectKebabPopUpShowWalletBindingError(state: State) {
  return state.matches('kebabPopUp.showingWalletBindingError');
}

export function selectKebabPopUpWalletBindingInProgress(state: State) {
  return state.matches('kebabPopUp.requestingBindingOtp') ||
    state.matches('kebabPopUp.addingWalletBindingId') ||
    state.matches('kebabPopUp.addKeyPair') ||
    state.matches('kebabPopUp.updatingPrivateKey')
    ? true
    : false;
}

export function selectKebabPopUpBindingWarning(state: State) {
  return state.matches('kebabPopUp.showBindingWarning');
}

export function selectRemoveWalletWarning(state: State) {
  return state.matches('kebabPopUp.removeWallet');
}

export function selectIsPinned(state: State) {
  return state.context.isPinned;
}

export function selectOtpError(state: State) {
  return state.context.otpError;
}

export function selectShowActivities(state: State) {
  return state.matches('kebabPopUp.showActivities');
}

export function selectShowWalletBindingError(state: State) {
  return (
    state.matches('showingWalletBindingError') ||
    state.matches('kebabPopUp.showingWalletBindingError')
  );
}

export function selectLogoUrl(state: State) {
  return state.context.logoUrl;
}
