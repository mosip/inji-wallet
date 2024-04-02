import {DoneInvokeEvent, EventFrom, StateFrom, send} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../shared/GlobalContext';
import {
  BACKUP_ENC_KEY,
  BACKUP_ENC_KEY_TYPE,
  BACKUP_ENC_TYPE_VAL_PASSWORD,
  BACKUP_ENC_TYPE_VAL_PHONE,
  argon2iConfigForPasswordAndPhoneNumber,
  argon2iSalt,
} from '../../shared/constants';
import {hashData} from '../../shared/commonUtil';
import {StoreEvents} from '../store';
import Storage from '../../shared/storage';
import {compressData} from '../../shared/cryptoutil/cryptoUtil';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    otp: '',
    baseEncKey: '',
    dataFromStorage: {},
    hashedEncKey: '',
    fileName: '',
  },
  {
    events: {
      DATA_BACKUP: () => ({}),
      YES: () => ({}),
      PASSWORD: () => ({}),
      SET_BASE_ENC_KEY: (baseEncKey: string) => ({baseEncKey}),
      FILE_NAME: (filename: string) => ({filename}),
      PHONE_NUMBER: () => ({}),
      SEND_OTP: () => ({}),
      INPUT_OTP: (otp: string) => ({otp}),
      BACK: () => ({}),
      CANCEL: () => ({}),
      WAIT: () => ({}),
      CANCEL_DOWNLOAD: () => ({}),
      STORE_RESPONSE: (response: unknown) => ({response}),
    },
  },
);

export const BackupWithEncryptionEvents = model.events;

export const backupWithEncryptionMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./backupWithEncryption.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'WithEncryption',
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
          },
          STORE_RESPONSE: {
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
            actions: ['setHashedKey', 'storeHashedEncKey'],
          },
        },
        on: {
          STORE_RESPONSE: {
            target: 'backingUp',
          },
        },
      },
      backingUp: {
        initial: 'checkStorageAvailability',
        states: {
          idle: {},
          checkStorageAvailability: {
            entry: ['sendDataBackupStartEvent'],
            invoke: {
              src: 'checkStorageAvailability',
              onDone: [
                {
                  cond: 'isMinimumStorageRequiredForBackupReached',
                  target: 'failure',
                },
                {
                  target: 'fetchDataFromDB',
                },
              ],
            },
          },
          fetchDataFromDB: {
            entry: ['fetchAllDataFromDB'],
            on: {
              STORE_RESPONSE: {
                actions: 'setDataFromStorage',
                target: 'writeDataToFile',
              },
            },
          },
          writeDataToFile: {
            invoke: {
              src: 'writeDataToFile',
            },
            on: {
              FILE_NAME: {
                actions: 'setFileName',
                target: 'zipBackupFile',
              },
            },
          },
          zipBackupFile: {
            invoke: {
              src: 'zipBackupFile',
              onDone: {
                target: 'success',
              },
              onError: {
                target: 'failure',
              },
            },
          },
          success: {
            entry: 'sendDataBackupSuccessEvent',
          },
          failure: {
            entry: 'sendDataBackupFailureEvent',
          },
        },
      },
    },
  },
  {
    actions: {
      setOtp: model.assign({
        otp: (_context, event) => {
          return event.otp;
        },
      }),

      setDataFromStorage: model.assign({
        dataFromStorage: (_context, event) => {
          return event.response;
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
      fetchAllDataFromDB: send(StoreEvents.EXPORT(), {
        to: context => context.serviceRefs.store,
      }),
    },

    services: {
      hashEncKey: async context => {
        return await hashData(
          context.baseEncKey,
          argon2iSalt,
          argon2iConfigForPasswordAndPhoneNumber,
        ).then(value => value);
      },

      writeDataToFile: context => async callack => {
        await Storage.writeToBackupFile(context.dataFromStorage);
      },

      zipBackupFile: context => async callback => {
        const result = await compressData(context.fileName);
        return result;
      },
    },

    guards: {},
  },
);

export function createBackupMachine(serviceRefs: AppServices) {
  return backupWithEncryptionMachine.withContext({
    ...backupWithEncryptionMachine.context,
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
type State = StateFrom<typeof backupWithEncryptionMachine>;
