import NetInfo from '@react-native-community/netinfo';
import {EventFrom, StateFrom, send} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../shared/GlobalContext';
import {
  NETWORK_REQUEST_FAILED,
  SETTINGS_STORE_KEY,
  isIOS,
} from '../../shared/constants';
import Cloud, {
  IsIOSResult,
  ProfileInfo,
  SignInResult,
  isSignedInResult,
} from '../../shared/googleCloudUtils';
import {ErrorMessage} from '../../shared/openId4VCI/Utils';
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';
import {
  getEndEventData,
  getErrorEventData,
  getImpressionEventData,
  getStartEventData,
  sendEndEvent,
  sendErrorEvent,
  sendImpressionEvent,
  sendStartEvent,
} from '../../shared/telemetry/TelemetryUtils';
import {SettingsEvents} from '../settings';
import {StoreEvents} from '../store';
import {Linking} from 'react-native';

const model = createModel(
  {
    isLoading: false as boolean,
    profileInfo: undefined as ProfileInfo | undefined,
    errorMessage: '' as string,
    serviceRefs: {} as AppServices,
    showConfirmation: false as boolean,
    shouldTriggerAutoBackup: false as boolean,
  },
  {
    events: {
      HANDLE_BACKUP_AND_RESTORE: () => ({}),
      PROCEED: () => ({}),
      GO_BACK: () => ({}),
      TRY_AGAIN: () => ({}),
      OPEN_SETTINGS: () => ({}),
      DISMISS: () => ({}),
      STORE_RESPONSE: (response: unknown) => ({response}),
    },
  },
);

export const BackupAndRestoreSetupEvents = model.events;

export const backupAndRestoreSetupMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./backupAndRestoreSetup.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'backupAndRestore',
    initial: 'init',
    states: {
      init: {
        on: {
          HANDLE_BACKUP_AND_RESTORE: {
            actions: [
              'setIsLoading',
              'unsetShouldTriggerAutoBackup',
              'sendDataBackupAndRestoreSetupStartEvent',
            ],
            target: 'fetchShowConfirmationInfo',
          },
        },
      },
      fetchShowConfirmationInfo: {
        /*TODO: Check if this call to store can be replaced by settings machine itself
         *This would avoid extra read calls to storage
         */
        entry: 'fetchShowConfirmationInfo',
        on: {
          STORE_RESPONSE: [
            {
              cond: 'isConfirmationAlreadyShown',
              actions: 'setShowConfirmation',
              target: 'checkSignIn',
            },
            {
              actions: ['unsetIsLoading', 'setShowConfirmation'],
              target: 'selectCloudAccount',
            },
          ],
        },
        states: {},
      },
      selectCloudAccount: {
        on: {
          GO_BACK: {
            actions: 'sendBackupAndRestoreSetupCancelEvent',
            target: 'init',
          },
          PROCEED: [
            {
              actions: 'setIsLoading',
              target: 'checkSignIn',
            },
          ],
        },
        states: {},
      },
      checkSignIn: {
        invoke: {
          src: 'isUserSignedAlready',
          onDone: [
            {
              cond: 'isSignedIn',
              actions: [
                () => console.log('isSignedIn'),
                'setProfileInfo',
                'unsetIsLoading',
              ],
              target: 'backupAndRestore',
            },
            {
              cond: 'isNetworkError',
              actions: [() => console.log('isNetworkError'), 'unsetIsLoading'],
              target: 'noInternet',
            },
            {
              cond: 'isNotSignedInIOSAndViaConfirmationFlow',
              actions: [
                () => console.log('isNotSignedInIOSAndViaConfirmationFlow'),
                'unsetIsLoading',
                'setErrorReasonAsAccountRequired',
              ],
              target: '.error',
            },
            {
              cond: 'isNotSignedInIOS',
              actions: [
                () => console.log('isNotSignedInIOS'),
                'unsetIsLoading',
                'setErrorReasonAsAccountRequired',
              ],
              target: '.error',
            },
            {
              actions: [
                () => console.log('isSignedInAndroid'),
                'unsetIsLoading',
              ],
              target: 'signIn',
            },
          ],
        },
        states: {
          error: {
            entry: 'unsetIsLoading',
            on: {
              GO_BACK: {
                actions: 'sendBackupAndRestoreSetupCancelEvent',
                target: '#backupAndRestore.init',
              },
              OPEN_SETTINGS: {
                actions: 'openSettings',
                target: '#backupAndRestore.init',
              },
            },
          },
        },
      },
      checkInternet: {
        invoke: {
          src: 'checkInternet',
          onDone: [
            {
              cond: 'isInternetConnected',
              target: 'signIn',
            },
            {
              actions: ['setNoInternet'],
              target: 'noInternet',
            },
          ],
          onError: {
            actions: () =>
              console.log('Error Occurred while checking Internet'),
            target: 'noInternet',
          },
        },
      },
      noInternet: {
        on: {
          TRY_AGAIN: {
            target: 'checkInternet',
          },
          DISMISS: {
            actions: ['unsetIsLoading', 'sendBackupAndRestoreSetupCancelEvent'],
            target: 'init',
          },
        },
      },
      signIn: {
        id: 'signIn',
        invoke: {
          src: 'signIn',
          onDone: [
            {
              cond: 'isSignInSuccessful',
              actions: ['setProfileInfo', 'setShouldTriggerAutoBackup'],
              target: 'backupAndRestore',
            },
            {
              cond: 'isIOS',
              target: 'backupAndRestore',
            },
            {
              actions: 'sendBackupAndRestoreSetupErrorEvent',
              target: '.error',
            },
          ],
        },
        initial: 'idle',
        states: {
          idle: {},
          error: {
            on: {
              GO_BACK: {
                actions: 'sendBackupAndRestoreSetupCancelEvent',
                target: '#backupAndRestore.init',
              },
              TRY_AGAIN: '#backupAndRestore.signIn',
            },
          },
        },
      },
      backupAndRestore: {
        entry: [
          'sendBackupAndRestoreSetupSuccessEvent',
          'setAccountSelectionConfirmationShown',
        ],
        on: {GO_BACK: 'init'},
      },
    },
  },
  {
    actions: {
      setIsLoading: model.assign({
        isLoading: true,
      }),
      unsetIsLoading: model.assign({
        isLoading: false,
      }),
      setProfileInfo: model.assign({
        profileInfo: (_context, event) => event.data?.profileInfo,
      }),
      setNoInternet: model.assign({
        errorMessage: () => ErrorMessage.NO_INTERNET,
      }),
      sendDataBackupAndRestoreSetupStartEvent: () => {
        sendStartEvent(
          getStartEventData(
            TelemetryConstants.FlowType.dataBackupAndRestoreSetup,
          ),
        );
        sendImpressionEvent(
          getImpressionEventData(
            TelemetryConstants.FlowType.dataBackupAndRestoreSetup,
            TelemetryConstants.Screens.dataBackupAndRestoreSetupScreen,
          ),
        );
      },

      sendBackupAndRestoreSetupSuccessEvent: () => {
        sendEndEvent(
          getEndEventData(
            TelemetryConstants.FlowType.dataBackupAndRestoreSetup,
            TelemetryConstants.EndEventStatus.success,
          ),
        );
      },

      sendBackupAndRestoreSetupCancelEvent: () => {
        sendEndEvent(
          getEndEventData(
            TelemetryConstants.FlowType.dataBackupAndRestoreSetup,
            TelemetryConstants.EndEventStatus.cancel,
            {comment: 'User cancelled backup and restore setup'},
          ),
        );
      },

      sendBackupAndRestoreSetupErrorEvent: (_context, event) => {
        sendErrorEvent(
          getErrorEventData(
            TelemetryConstants.FlowType.dataBackupAndRestoreSetup,
            TelemetryConstants.ErrorId.userCancel,
            JSON.stringify(event.data),
          ),
        );
      },
      setShowConfirmation: model.assign({
        showConfirmation: (_context, event) =>
          !event.response.isAccountSelectionConfirmationShown || false,
      }),
      setErrorReasonAsAccountRequired: model.assign({
        errorMessage: 'noAccountAvailable',
      }),
      setAccountSelectionConfirmationShown: send(
        () => SettingsEvents.SHOWN_ACCOUNT_SELECTION_CONFIRMATION(),
        {to: context => context.serviceRefs.settings},
      ),
      fetchShowConfirmationInfo: send(
        () => StoreEvents.GET(SETTINGS_STORE_KEY),
        {to: context => context.serviceRefs.store},
      ),
      setShouldTriggerAutoBackup: model.assign({
        shouldTriggerAutoBackup: true,
      }),
      unsetShouldTriggerAutoBackup: model.assign({
        shouldTriggerAutoBackup: false,
      }),
      openSettings: () => Linking.openURL('App-Prefs:CASTLE'),
    },

    services: {
      checkInternet: async () => await NetInfo.fetch(),
      isUserSignedAlready: () => async () => {
        return await Cloud.isSignedInAlready();
      },
      signIn: () => async () => {
        return await Cloud.signIn();
      },
    },

    guards: {
      isInternetConnected: (_, event) => event.data.isConnected,
      isNetworkError: (_, event) => event.data.error === NETWORK_REQUEST_FAILED,
      isSignedIn: (_context, event) =>
        (event.data as isSignedInResult).isSignedIn,
      isNotSignedInIOS: (_context, event) => {
        return !(event.data as isSignedInResult).isSignedIn && isIOS();
      },
      isNotSignedInIOSAndViaConfirmationFlow: (context, event) => {
        return (
          context.showConfirmation &&
          !(event.data as isSignedInResult).isSignedIn &&
          isIOS()
        );
      },
      isConfirmationAlreadyShown: (_context, event) => {
        console.log('isConfirmationAlreadyShown ', event.response as Object);
        return (
          (event.response as Object)['encryptedData'][
            'isAccountSelectionConfirmationShown'
          ] || false
        );
      },
      isSignInSuccessful: (_context, event) =>
        (event.data as SignInResult).status === Cloud.status.SUCCESS,
      isIOS: (_context, event) => (event.data as IsIOSResult).isIOS || false,
    },
  },
);

export function createBackupAndRestoreSetupMachine(serviceRefs: AppServices) {
  return backupAndRestoreSetupMachine.withContext({
    ...backupAndRestoreSetupMachine.context,
    serviceRefs,
  });
}
export function selectIsLoading(state: State) {
  return state.context.isLoading;
}

export function selectProfileInfo(state: State) {
  return state.context.profileInfo;
}

export function selectIsNetworkOff(state: State) {
  return state.matches('noInternet');
}

export function selectShouldTriggerAutoBackup(state: State) {
  return state.context.shouldTriggerAutoBackup;
}

export function selectShowAccountSelectionConfirmation(state: State) {
  return state.matches('selectCloudAccount');
}

export function selectIsSigningIn(state: State) {
  return state.matches('signIn');
}

export function selectIsSigningInSuccessful(state: State) {
  return state.matches('backupAndRestore');
}

export function selectIsSigningFailure(state: State) {
  return state.matches('signIn.error') || state.matches('checkSignIn.error');
}

type State = StateFrom<typeof backupAndRestoreSetupMachine>;
