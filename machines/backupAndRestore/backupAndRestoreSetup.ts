import {EventFrom, StateFrom} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../shared/GlobalContext';
import Cloud, {
  ProfileInfo,
  SignInResult,
  isSignedInResult,
  IsIOSResult,
} from '../../shared/googleCloudUtils';
import NetInfo from '@react-native-community/netinfo';
import {ErrorMessage} from '../../shared/openId4VCI/Utils';
import {NETWORK_REQUEST_FAILED} from '../../shared/constants';
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
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';

const model = createModel(
  {
    isLoading: false as boolean,
    profileInfo: undefined as ProfileInfo | undefined,
    errorMessage: '' as string,
    shouldTriggerAutoBackup: false as boolean,
  },
  {
    events: {
      HANDLE_BACKUP_AND_RESTORE: () => ({}),
      PROCEED: () => ({}),
      GO_BACK: () => ({}),
      TRY_AGAIN: () => ({}),
      DISMISS: () => ({}),
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
              'sendDataBackupAndRestoreSetupStartEvent',
              'setIsLoading',
              'unsetShouldTriggerAutoBackup',
            ],
            target: 'checkSignIn',
          },
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
              actions: ['unsetIsLoading'],
              target: 'noInternet',
            },
            {
              actions: ['unsetIsLoading'],
              target: 'selectCloudAccount',
            },
          ],
        },
      },
      selectCloudAccount: {
        on: {
          PROCEED: {
            target: 'checkInternet',
          },
          GO_BACK: {
            actions: 'sendBackupAndRestoreSetupCancelEvent',
            target: 'init',
          },
        },
        states: {},
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
        entry: 'sendBackupAndRestoreSetupSuccessEvent',
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
        profileInfo: (_context, event) => event.data.profileInfo,
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
      setShouldTriggerAutoBackup: model.assign({
        shouldTriggerAutoBackup: true,
      }),
      unsetShouldTriggerAutoBackup: model.assign({
        shouldTriggerAutoBackup: false,
      }),
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

      isSignInSuccessful: (_context, event) =>
        (event.data as SignInResult).status === Cloud.status.SUCCESS,
      isIOS: (_context, event) => (event.data as IsIOSResult).isIOS,
    },
  },
);

export function createBackupAndRestoreSetupMachine(serviceRefs: AppServices) {
  return backupAndRestoreSetupMachine.withContext({
    ...backupAndRestoreSetupMachine.context,
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
  return state.matches('signIn.error');
}

type State = StateFrom<typeof backupAndRestoreSetupMachine>;
