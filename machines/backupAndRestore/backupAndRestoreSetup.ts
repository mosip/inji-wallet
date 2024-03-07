import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
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
} from '../../shared/CloudBackupAndRestoreUtils';
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
      RECONFIGURE_ACCOUNT: () => ({}),
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
    id: 'backupAndRestoreSetup',
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
            target: '.checkInternet',
          },
        },
        initial: 'idle',
        states: {
          idle: {},
          checkInternet: {
            invoke: {
              src: 'checkInternet',
              onDone: [
                {
                  cond: 'isInternetConnected',
                  target: '#backupAndRestoreSetup.fetchShowConfirmationInfo',
                },
                {
                  actions: 'unsetIsLoading',
                  target: 'noInternet',
                },
              ],
              onError: {
                actions: 'unsetIsLoading',
                target: 'noInternet',
              },
            },
          },
          noInternet: {
            on: {
              TRY_AGAIN: {
                actions: 'setIsLoading',
                target: 'checkInternet',
              },
              DISMISS: {
                actions: ['unsetIsLoading'],
                target: '#backupAndRestoreSetup.init',
              },
            },
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
      },
      checkSignIn: {
        invoke: {
          src: 'isUserSignedAlready',
          onDone: [
            {
              cond: 'isSignedIn',
              actions: ['setProfileInfo', 'unsetIsLoading'],
              target: 'backupAndRestore',
            },
            {
              cond: 'isNetworkError',
              target: '.noInternet',
            },
            {
              cond: 'isNotSignedInIOS',
              actions: ['unsetIsLoading', 'setErrorReasonAsAccountRequired'],
              target: '.error',
            },
            {
              actions: ['unsetIsLoading'],
              target: 'signIn',
            },
          ],
        },
        initial: 'idle',
        states: {
          idle: {},
          error: {
            entry: 'unsetIsLoading',
            on: {
              GO_BACK: {
                actions: 'sendBackupAndRestoreSetupCancelEvent',
                target: '#backupAndRestoreSetup.init',
              },
              OPEN_SETTINGS: {
                actions: 'openSettings',
                target: '#backupAndRestoreSetup.init',
              },
            },
          },
          noInternet: {
            on: {
              TRY_AGAIN: {
                target: '#backupAndRestoreSetup.checkSignIn',
              },
              DISMISS: {
                actions: [
                  'unsetIsLoading',
                  'sendBackupAndRestoreSetupCancelEvent',
                ],
                target: '#backupAndRestoreSetup.init',
              },
            },
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
            // isIOS not required as we dont reach sign in state itself
            {
              cond: 'isIOS',
              target: 'backupAndRestore',
            },
            // What if sign in fails due to n/w error?
            {
              cond: 'isNetworkError',
              actions: 'sendBackupAndRestoreSetupErrorEvent',
              target: '.noInternet',
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
                target: '#backupAndRestoreSetup.init',
              },
              RECONFIGURE_ACCOUNT: '#backupAndRestoreSetup.signIn',
            },
          },
          noInternet: {
            on: {
              TRY_AGAIN: {
                target: '#backupAndRestoreSetup.signIn',
              },
              DISMISS: {
                actions: ['sendBackupAndRestoreSetupCancelEvent'],
                target: '#backupAndRestoreSetup.init',
              },
            },
          },
        },
      },
      backupAndRestore: {
        entry: ['setAccountSelectionConfirmationShown'],
        on: {
          GO_BACK: 'init',
          DISMISS: {
            actions: 'sendBackupAndRestoreSetupCancelEvent',
            target: 'init',
          },
        },
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

      sendBackupAndRestoreSetupCancelEvent: () => {
        sendEndEvent(
          getEndEventData(
            TelemetryConstants.FlowType.dataBackupAndRestoreSetup,
            TelemetryConstants.EndEventStatus.cancel,
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
      isUserSignedAlready: () => async () => {
        return await Cloud.isSignedInAlready();
      },
      signIn: () => async () => {
        return await Cloud.signIn();
      },
      checkInternet: async () => await NetInfo.fetch(),
    },

    guards: {
      isInternetConnected: (_, event) =>
        !!(event.data as NetInfoState).isConnected,
      isNetworkError: (_, event) => event.data.error === NETWORK_REQUEST_FAILED,
      isSignedIn: (_context, event) =>
        (event.data as isSignedInResult).isSignedIn,
      isNotSignedInIOS: (_context, event) => {
        return !(event.data as isSignedInResult).isSignedIn && isIOS();
      },
      isConfirmationAlreadyShown: (_context, event) => {
        return (
          (event.response as Object)['encryptedData'][
            'isAccountSelectionConfirmationShown'
          ] || false
        );
      },
      isSignInSuccessful: (_context, event) =>
        (event.data as SignInResult).status === Cloud.status.SUCCESS,
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
  return (
    state.matches('init.noInternet') ||
    state.matches('checkSignIn.noInternet') ||
    state.matches('signIn.noInternet')
  );
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
