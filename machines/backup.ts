import {EventFrom, StateFrom} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {AppServices} from '../shared/GlobalContext';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    otp: '',
    phoneNumber: '',
    password: '',
  },
  {
    events: {
      DATA_BACKUP: () => ({}),
      YES: () => ({}),
      PASSWORD: () => ({}),
      SET_PASSWORD: (password: string) => ({password}),
      PHONE_NUMBER: () => ({}),
      SET_PHONE_NUMBER: (phoneNumber: string) => ({phoneNumber}),
      SEND_OTP: () => ({}),
      INPUT_OTP: (otp: string) => ({otp}),
      BACK: () => ({}),
      CANCEL: () => ({}),
      WAIT: () => ({}),
      CANCEL_DOWNLOAD: () => ({}),
    },
  },
);

export const BackupEvents = model.events;

export const backupMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./backup.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'backup',
    initial: 'init',
    states: {
      init: {
        on: {
          DATA_BACKUP: [
            {
              target: 'backUp',
            },
          ],
        },
      },
      backUp: {
        on: {
          YES: {
            target: 'selectPref',
          },
        },
      },
      selectPref: {
        on: {
          PASSWORD: {
            target: 'passwordBackup',
          },
          PHONE_NUMBER: {
            target: 'phoneNumberBackup',
          },
        },
      },
      passwordBackup: {
        on: {
          SET_PASSWORD: {
            actions: 'setPassword',
            target: 'backingUp',
          },
        },
      },

      phoneNumberBackup: {
        on: {
          SET_PHONE_NUMBER: {
            actions: 'setPhoneNumber',
          },
          SEND_OTP: {
            target: 'requestOtp',
          },
        },
      },
      requestOtp: {
        on: {
          WAIT: {},
          CANCEL: {},
          CANCEL_DOWNLOAD: {},
          INPUT_OTP: {
            actions: 'setOtp', // TODO: we should also do the otp Verification here
            target: 'backingUp',
          },
        },
        invoke: {
          src: 'requestOtp',
          onDone: [
            {
              target: '',
            },
          ],
          onError: [
            {
              actions: '',
              target: '',
            },
          ],
        },
      },
      backingUp: {},
    },
  },
  {
    actions: {
      setOtp: model.assign({
        otp: (_context, event) => {
          return event.otp;
        },
      }),
      setPassword: model.assign({
        password: (_context, event) => {
          return event.password;
        },
      }),
      setPhoneNumber: model.assign({
        phoneNumber: (_context, event) => {
          return event.phoneNumber;
        },
      }),
    },

    services: {},

    guards: {},
  },
);

export function createBackupMachine(serviceRefs: AppServices) {
  return backupMachine.withContext({
    ...backupMachine.context,
    serviceRefs,
  });
}
export function selectIsBackupPref(state: State) {
  return state.matches('selectPref');
}
export function selectIsBackupViaPassword(state: State) {
  return state.matches('passwordBackup');
}
export function selectIsBackupViaPhoneNumber(state: State) {
  return state.matches('phoneNumberBackup');
}
export function selectIsRequestOtp(state: State) {
  return state.matches('requestOtp');
}
export function selectIsBackingUp(state: State) {
  return state.matches('backingUp');
}
export function selectIsCancellingDownload(state: State) {
  // TODO: check cancelDownload based on state
  return false;
}
type State = StateFrom<typeof backupMachine>;
