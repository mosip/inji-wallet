import {DoneInvokeEvent, EventFrom, StateFrom, send} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {AppServices} from '../shared/GlobalContext';
import {
  BACKUP_ENC_KEY,
  BACKUP_ENC_KEY_TYPE,
  BACKUP_ENC_TYPE_VAL_PASSWORD,
  BACKUP_ENC_TYPE_VAL_PHONE,
  argon2iConfigForPasswordAndPhoneNumber,
  argon2iSalt,
} from '../shared/constants';
import {hashData} from './../shared/commonUtil';
import {StoreEvents} from './store';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    otp: '',
    baseEncKey: '',
    hashedEncKey: '',
  },
  {
    events: {
      DATA_BACKUP: () => ({}),
      YES: () => ({}),
      PASSWORD: () => ({}),
      SET_BASE_ENC_KEY: (baseEncKey: string) => ({baseEncKey}),
      PHONE_NUMBER: () => ({}),
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
          SET_BASE_ENC_KEY: {
            actions: ['setBaseEncKey', 'storePasswordKeyType'],
            target: 'hashKey',
          },
        },
      },

      phoneNumberBackup: {
        on: {
          SET_BASE_ENC_KEY: {
            actions: 'setBaseEncKey',
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
            actions: ['setOtp', 'storePhoneNumberKeyType'], // TODO: we should also do the otp Verification here
            target: 'hashKey',
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
      hashKey: {
        invoke: {
          src: 'hashEncKey',
          onDone: {
            target: 'backingUp',
            actions: ['setHashedKey', 'storeHashedEncKey'],
          },
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
      setBaseEncKey: model.assign({
        baseEncKey: (_context, event) => {
          return event.baseEncKey;
        },
      }),

      setHashedKey: model.assign({
        hashedEncKey: (_context, event) =>
          (event as DoneInvokeEvent<string>).data,
      }),

      storeHashedEncKey: send(
        context => StoreEvents.SET(BACKUP_ENC_KEY, context.hashedEncKey),
        {
          to: context => context.serviceRefs.store,
        },
      ),

      storePasswordKeyType: send(
        () =>
          StoreEvents.SET(BACKUP_ENC_KEY_TYPE, BACKUP_ENC_TYPE_VAL_PASSWORD),
        {
          to: context => context.serviceRefs.store,
        },
      ),
      storePhoneNumberKeyType: send(
        () => StoreEvents.SET(BACKUP_ENC_KEY_TYPE, BACKUP_ENC_TYPE_VAL_PHONE),
        {
          to: context => context.serviceRefs.store,
        },
      ),
    },

    services: {
      hashEncKey: async context => {
        return await hashData(
          context.baseEncKey,
          argon2iSalt,
          argon2iConfigForPasswordAndPhoneNumber,
        ).then(value => value);
      },
    },

    guards: {},
  },
);

export function createBackupMachine(serviceRefs: AppServices) {
  return backupMachine.withContext({
    ...backupMachine.context,
    serviceRefs,
  });
}
export function selectIsEnableBackup(state: State) {
  return state.matches('backUp');
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
