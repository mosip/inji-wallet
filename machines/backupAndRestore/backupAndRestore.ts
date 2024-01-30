import {EventFrom, StateFrom} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../shared/GlobalContext';
import Cloud, {
  ProfileInfo,
  SignInResult,
  isSignedInResult,
} from '../../shared/googleCloudUtils';
import NetInfo from '@react-native-community/netinfo';
import {ErrorMessage} from '../../shared/openId4VCI/Utils';
import {NETWORK_REQUEST_FAILED} from '../../shared/constants';

const model = createModel(
  {
    isLoading: false as boolean,
    profileInfo: undefined as ProfileInfo | undefined,
    errorMessage: '' as string,
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

export const BackupAndRestoreEvents = model.events;

export const backupAndRestoreMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./backupAndRestore.typegen').Typegen0,
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
            actions: 'setIsLoading',
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
          GO_BACK: 'init',
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
            actions: ['unsetIsLoading'],
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
              actions: 'setProfileInfo',
              target: 'backupAndRestore',
            },
            {
              target: '.error',
            },
          ],
        },
        initial: 'idle',
        states: {
          idle: {},
          error: {
            on: {
              GO_BACK: '#backupAndRestore.init',
              TRY_AGAIN: '#backupAndRestore.signIn',
            },
          },
        },
      },
      backupAndRestore: {
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
    },
  },
);

export function createBackupMachine(serviceRefs: AppServices) {
  return backupAndRestoreMachine.withContext({
    ...backupAndRestoreMachine.context,
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

type State = StateFrom<typeof backupAndRestoreMachine>;
