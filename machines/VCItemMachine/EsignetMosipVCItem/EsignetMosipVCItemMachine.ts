import {assign, ErrorPlatformEvent, EventFrom, send, StateFrom} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../../shared/GlobalContext';
import {VCMetadata} from '../../../shared/VCMetadata';
import {VC} from '../../../types/VC/ExistingMosipVC/vc';
import {
  generateKeys,
  isHardwareKeystoreExists,
  WalletBindingResponse,
} from '../../../shared/cryptoutil/cryptoUtil';
import {getIdType, Protocols} from '../../../shared/openId4VCI/Utils';
import {StoreEvents} from '../../../machines/store';
import {MIMOTO_BASE_URL, MY_VCS_STORE_KEY} from '../../../shared/constants';
import {VcEvents} from '../vc';
import i18n from '../../../i18n';
import {KeyPair} from 'react-native-rsa-native';
import {
  getBindingCertificateConstant,
  savePrivateKey,
} from '../../../shared/keystore/SecureKeystore';
import {ActivityLogEvents} from '../../../machines/activityLog';
import {request} from '../../../shared/request';
import SecureKeystore from '@mosip/secure-keystore';
import {VerifiableCredential} from './vc';
import {
  getEndEventData,
  getInteractEventData,
  getStartEventData,
  sendEndEvent,
  sendInteractEvent,
  sendStartEvent,
} from '../../../shared/telemetry/TelemetryUtils';
import {TelemetryConstants} from '../../../shared/telemetry/TelemetryConstants';

import {API_URLS} from '../../../shared/api';
import {BackupEvents} from '../../backupAndRestore/backup';
import Cloud, {
  isSignedInResult,
} from '../../../shared/CloudBackupAndRestoreUtils';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    vcMetadata: {} as VCMetadata,
    generatedOn: new Date() as Date,
    verifiableCredential: null as VerifiableCredential,
    hashedId: '',
    publicKey: '',
    privateKey: '',
    otp: '',
    otpError: '',
    idError: '',
    transactionId: '',
    bindingTransactionId: '',
    walletBindingResponse: null as WalletBindingResponse,
    tempWalletBindingIdResponse: null as WalletBindingResponse,
    walletBindingError: '',
    isMachineInKebabPopupState: false,
    bindingAuthFailedMessage: '' as string,
    phoneNumber: '' as string,
    email: '' as string,
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
      SHOW_BINDING_STATUS: () => ({}),
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
            actions: 'sendActivationStartEvent',
            target: 'requestingBindingOtp',
          },
          CANCEL: [
            {
              cond: context => context.isMachineInKebabPopupState,
              target: '#vc-item-openid4vci.kebabPopUp',
            },
            {
              target: 'idle',
            },
          ],
        },
      },
      requestingBindingOtp: {
        invoke: {
          src: 'requestBindingOtp',
          onDone: [
            {
              target: 'acceptingBindingOtp',
              actions: ['setPhoneNumber', 'setEmail'],
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
          CANCEL: [
            {
              cond: context => context.isMachineInKebabPopupState,
              actions: ['setWalletBindingErrorEmpty'],
              target: '#vc-item-openid4vci.kebabPopUp',
            },
            {
              actions: ['setWalletBindingErrorEmpty'],
              target: 'idle',
            },
          ],
        },
      },
      acceptingBindingOtp: {
        entry: ['clearOtp'],
        on: {
          INPUT_OTP: {
            target: 'addKeyPair',
            actions: ['setOtp'],
          },
          DISMISS: [
            {
              cond: context => context.isMachineInKebabPopupState,
              target: '#vc-item-openid4vci.kebabPopUp',
              actions: [
                'sendActivationFailedEndEvent',
                'clearOtp',
                'clearTransactionId',
              ],
            },
            {
              target: 'idle',
              actions: [
                'sendActivationFailedEndEvent',
                'clearOtp',
                'clearTransactionId',
              ],
            },
          ],
          RESEND_OTP: {
            target: '.resendOTP',
          },
        },
        initial: 'idle',
        states: {
          idle: {},
          resendOTP: {
            invoke: {
              src: 'requestBindingOtp',
              onDone: {
                target: 'idle',
                actions: ['setPhoneNumber', 'setEmail'],
              },
              onError: {
                actions: 'setWalletBindingError',
                target: '#vc-item-openid4vci.showingWalletBindingError',
              },
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
              target: 'updatingContextVariables',
            },
            {
              target: 'updatingPrivateKey',
              /*The walletBindingResponse is used for conditional rendering in wallet binding. 
                However, it wrongly considers activation as successful even when there's an error 
                in updatingPrivateKey state. So created a temporary context variable to store the binding 
                response and use it in updatingPrivateKey state*/
              actions: 'setTempWalletBindingResponse',
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
            target: 'updatingContextVariables',
          },
          onError: {
            actions: [
              'setWalletBindingError',
              'logWalletBindingFailure',
              'sendActivationFailedEndEvent',
            ],
            target: 'showingWalletBindingError',
          },
        },
      },

      updatingContextVariables: {
        entry: [
          'setWalletBindingId',
          'setThumbprintForWalletBindingId',
          'storeContext',
          'updatePrivateKey',
          'updateVc',
          'setWalletBindingErrorEmpty',
          'sendActivationSuccessEvent',
          'logWalletBindingSuccess',
          send('SHOW_BINDING_STATUS'),
        ],
        on: {
          SHOW_BINDING_STATUS: [
            {
              cond: context => context.isMachineInKebabPopupState,
              actions: 'sendWalletBindingSuccess',
              target: '#vc-item-openid4vci.kebabPopUp',
            },
            {
              actions: 'sendWalletBindingSuccess',
              target: 'idle',
            },
          ],
        },
      },
      idle: {
        on: {
          DISMISS: {
            target: 'checkingVc',
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
        entry: 'sendVcUpdated',
        always: {
          target: 'idle',
        },
      },
      kebabPopUp: {
        entry: assign({
          isMachineInKebabPopupState: () => {
            return true;
          },
        }),
        on: {
          DISMISS: {
            actions: assign({
              isMachineInKebabPopupState: () => false,
            }),
            target: 'idle',
          },
          ADD_WALLET_BINDING_ID: {
            target: '#vc-item-openid4vci.showBindingWarning',
          },
          PIN_CARD: {
            target: '#vc-item-openid4vci.pinCard',
            actions: [
              'setPinCard',
              assign({
                isMachineInKebabPopupState: () => false,
              }),
            ],
          },
          SHOW_ACTIVITY: {
            target: '#vc-item-openid4vci.kebabPopUp.showActivities',
          },
          REMOVE: {
            actions: [
              'setVcKey',
              assign({
                isMachineInKebabPopupState: () => false,
              }),
            ],
            target: '#vc-item-openid4vci.kebabPopUp.removeWallet',
          },
        },
        initial: 'idle',
        states: {
          idle: {},
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
                target: 'triggerAutoBackup',
              },
            },
          },
          triggerAutoBackup: {
            invoke: {
              src: 'isUserSignedAlready',
              onDone: [
                {
                  cond: 'isSignedIn',
                  actions: ['sendBackupEvent', 'removedVc', 'logVCremoved'],
                  target: '#vc-item-openid4vci',
                },
                {
                  actions: ['removedVc', 'logVCremoved'],
                  target: '#vc-item-openid4vci',
                },
              ],
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
          const {
            serviceRefs,
            isMachineInKebabPopupState,
            tempWalletBindingIdResponse,
            ...data
          } = context;
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

      setPinCard: assign({
        vcMetadata: context =>
          new VCMetadata({
            ...context.vcMetadata,
            isPinned: !context.vcMetadata.isPinned,
          }),
      }),

      sendBackupEvent: send(BackupEvents.DATA_BACKUP(true), {
        to: context => context.serviceRefs.backup,
      }),

      sendVcUpdated: send(
        context => VcEvents.VC_METADATA_UPDATED(context.vcMetadata),
        {
          to: context => context.serviceRefs.vc,
        },
      ),

      setWalletBindingError: assign({
        walletBindingError: () =>
          i18n.t(`errors.genericError`, {
            ns: 'common',
          }),
        bindingAuthFailedMessage: (_context, event) => {
          const error = JSON.parse(JSON.stringify(event.data)).name;
          if (error) {
            return error;
          }
          return '';
        },
      }),

      setWalletBindingErrorEmpty: assign({
        walletBindingError: () => '',
        bindingAuthFailedMessage: () => '',
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

      sendActivationStartEvent: context => {
        sendStartEvent(
          getStartEventData(
            context.isMachineInKebabPopupState
              ? TelemetryConstants.FlowType.vcActivationFromKebab
              : TelemetryConstants.FlowType.vcActivation,
          ),
        );
        sendInteractEvent(
          getInteractEventData(
            context.isMachineInKebabPopupState
              ? TelemetryConstants.FlowType.vcActivationFromKebab
              : TelemetryConstants.FlowType.vcActivation,
            TelemetryConstants.InteractEventSubtype.click,
            'Activate Button',
          ),
        );
      },

      sendActivationFailedEndEvent: (context, event, meta) => {
        const [errorId, errorMessage] =
          event.data?.message === 'Could not store private key in keystore'
            ? [
                TelemetryConstants.ErrorId.updatePrivateKey,
                TelemetryConstants.ErrorMessage.privateKeyUpdationFailed,
              ]
            : [
                TelemetryConstants.ErrorId.userCancel,
                TelemetryConstants.ErrorMessage.activationCancelled,
              ];
        sendEndEvent(
          getEndEventData(
            context.isMachineInKebabPopupState
              ? TelemetryConstants.FlowType.vcActivationFromKebab
              : TelemetryConstants.FlowType.vcActivation,
            TelemetryConstants.EndEventStatus.failure,
            {
              errorId: errorId,
              errorMessage: errorMessage,
            },
          ),
        );
      },

      sendActivationSuccessEvent: context =>
        sendEndEvent(
          getEndEventData(
            context.isMachineInKebabPopupState
              ? TelemetryConstants.FlowType.vcActivationFromKebab
              : TelemetryConstants.FlowType.vcActivation,
            TelemetryConstants.EndEventStatus.success,
          ),
        ),

      setPublicKey: assign({
        publicKey: (context, event) => {
          if (!isHardwareKeystoreExists) {
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
        walletBindingResponse: (context, event) => {
          return isHardwareKeystoreExists
            ? (event.data as WalletBindingResponse)
            : context.tempWalletBindingIdResponse;
        },
      }),
      setTempWalletBindingResponse: assign({
        tempWalletBindingIdResponse: (context, event) =>
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
            idType: getIdType(context.vcMetadata.issuer),
            id: context.vcMetadata.id,
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
            id: context.vcMetadata.id,
            idType: getIdType(context.vcMetadata.issuer),
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

      setPhoneNumber: assign({
        phoneNumber: (_context, event) => event.data.response.maskedMobile,
      }),

      setEmail: model.assign({
        email: (_context, event) => event.data.response.maskedEmail,
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
            idType: getIdType(context.vcMetadata.issuer),
            id: context.vcMetadata.id,
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
      isUserSignedAlready: () => async () => {
        return await Cloud.isSignedInAlready();
      },

      updatePrivateKey: async context => {
        const hasSetPrivateKey: boolean = await savePrivateKey(
          context.tempWalletBindingIdResponse.walletBindingId,
          context.privateKey,
        );
        if (!hasSetPrivateKey) {
          throw new Error('Could not store private key in keystore.');
        }
        return '';
      },
      addWalletBindnigId: async context => {
        const response = await request(
          API_URLS.walletBinding.method,
          API_URLS.walletBinding.buildURL(),
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
        if (!isHardwareKeystoreExists) {
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
          API_URLS.bindingOtp.method,
          API_URLS.bindingOtp.buildURL(),
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
        return response;
      },
    },

    guards: {
      hasCredential: (_, event) => {
        const vc = event.vc;
        return vc != null;
      },
      isSignedIn: (_context, event) =>
        (event.data as isSignedInResult).isSignedIn,

      isCustomSecureKeystore: () => isHardwareKeystoreExists,
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
