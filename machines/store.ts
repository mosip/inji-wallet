import * as Keychain from 'react-native-keychain';
import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import binaryToBase64 from 'react-native/Libraries/Utilities/binaryToBase64';
import { EventFrom, Receiver, sendParent, send, sendUpdate } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { generateSecureRandom } from 'react-native-securerandom';
import { log } from 'xstate/lib/actions';

const ENCRYPTION_ID = 'c7c22a6c-9759-4605-ac88-46f4041d863d';

const model = createModel(
  {
    encryptionKey: '',
  },
  {
    events: {
      KEY_RECEIVED: (key: string) => ({ key }),
      READY: () => ({}),
      GET: (key: string) => ({ key }),
      SET: (key: string, value: any) => ({ key, value }),
      APPEND: (key: string, value: any) => ({ key, value }),
      PREPEND: (key: string, value: any) => ({ key, value }),
      REMOVE: (key: string) => ({ key }),
      CLEAR: () => ({}),
      ERROR: (error: Error) => ({ error }),
      STORE_RESPONSE: (response?: any, requester?: string) => ({
        response,
        requester,
      }),
      STORE_ERROR: (error: Error, requester?: string) => ({ error, requester }),
    },
  }
);

export const StoreEvents = model.events;

export type StoreResponseEvent = EventFrom<typeof model, 'STORE_RESPONSE'>;

type KeyReceivedEvent = EventFrom<typeof model, 'KEY_RECEIVED'>;

type ForwardedEvent = EventFrom<typeof model> & {
  requester: string;
};

export const storeMachine = model.createMachine(
  {
    id: 'store',
    context: model.initialContext,
    initial: 'gettingEncryptionKey',
    states: {
      gettingEncryptionKey: {
        invoke: {
          src: 'getEncryptionKey',
        },
        on: {
          KEY_RECEIVED: {
            target: 'ready',
            actions: ['setEncryptionKey'],
          },
          ERROR: 'generatingEncryptionKey',
        },
      },
      generatingEncryptionKey: {
        invoke: {
          src: 'generateEncryptionKey',
        },
        on: {
          KEY_RECEIVED: {
            target: 'resettingStorage',
            actions: ['setEncryptionKey'],
          },
          ERROR: {
            actions: [log('Generating encryption key failed')],
          },
        },
      },
      resettingStorage: {
        invoke: {
          src: 'clear',
          onDone: 'ready',
          onError: {
            actions: [log('Resetting storage failed')],
          },
        },
      },
      ready: {
        entry: ['notifyParent'],
        invoke: {
          id: '_store',
          src: 'store',
        },
        on: {
          GET: { actions: ['forwardStoreRequest'] },
          SET: { actions: ['forwardStoreRequest'] },
          APPEND: { actions: ['forwardStoreRequest'] },
          PREPEND: { actions: ['forwardStoreRequest'] },
          REMOVE: { actions: ['forwardStoreRequest'] },
          CLEAR: { actions: ['forwardStoreRequest'] },
          STORE_RESPONSE: {
            actions: [
              send((_, event) => model.events.STORE_RESPONSE(event.response), {
                to: (_, event) => event.requester,
              }),
              sendUpdate(),
            ],
          },
          STORE_ERROR: {
            actions: [
              send((_, event) => model.events.STORE_ERROR(event.error), {
                to: (_, event) => event.requester,
              }),
            ],
          },
        },
      },
    },
  },
  {
    actions: {
      notifyParent: sendParent(model.events.READY()),

      forwardStoreRequest: send(
        (_, event, meta) => ({
          ...event,
          requester: meta._event.origin,
        }),
        { to: '_store' }
      ),

      setEncryptionKey: model.assign({
        encryptionKey: (_, event: KeyReceivedEvent) => event.key,
      }),
    },

    services: {
      clear,

      store: (context) => (callback, onReceive: Receiver<ForwardedEvent>) => {
        onReceive(async (event) => {
          try {
            let response: any;
            switch (event.type) {
            case 'GET': {
              response = await getItem(
                event.key,
                null,
                context.encryptionKey
              );
              break;
            }
            case 'SET': {
              await setItem(event.key, event.value, context.encryptionKey);
              response = event.value;
              break;
            }
            case 'APPEND': {
              await appendItem(event.key, event.value, context.encryptionKey);
              response = event.value;
              break;
            }
            case 'PREPEND': {
              await prependItem(
                event.key,
                event.value,
                context.encryptionKey
              );

              response = event.value;
              break;
            }
            case 'REMOVE': {
              await removeItem(event.key);
              break;
            }
            case 'CLEAR': {
              await clear();
              break;
            }
            default:
              return;
            }
            callback(model.events.STORE_RESPONSE(response, event.requester));
          } catch (e) {
            console.error(e);
            callback(model.events.STORE_ERROR(e, event.requester));
          }
        });
      },

      getEncryptionKey: () => async (callback) => {
        const existingCredentials = await Keychain.getGenericPassword();

        if (existingCredentials) {
          callback(model.events.KEY_RECEIVED(existingCredentials.password));
        } else {
          callback(
            model.events.ERROR(new Error('Could not get keychain credentials.'))
          );
        }
      },

      generateEncryptionKey: () => async (callback) => {
        const randomBytes = await generateSecureRandom(32);
        const randomBytesString = binaryToBase64(randomBytes);
        const hasSetCredentials = await Keychain.setGenericPassword(
          ENCRYPTION_ID,
          randomBytesString
        );

        if (hasSetCredentials) {
          callback(model.events.KEY_RECEIVED(randomBytesString));
        } else {
          callback(
            model.events.ERROR(
              new Error('Could not generate keychain credentials.')
            )
          );
        }
      },
    },

    guards: {},
  }
);

export async function setItem(key: string, value: any, encryptionKey: string) {
  try {
    const data = JSON.stringify(value);
    const encrypted = encryptJson(encryptionKey, data);
    await AsyncStorage.setItem(key, encrypted);
  } catch (e) {
    console.error('error setItem:', e);
    throw e;
  }
}

export async function getItem(
  key: string,
  defaultValue: any,
  encryptionKey: string
) {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data != null) {
      const decrypted = decryptJson(encryptionKey, data);
      return JSON.parse(decrypted);
    } else {
      return defaultValue;
    }
  } catch (e) {
    return defaultValue;
  }
}

export async function appendItem(
  key: string,
  value: any,
  encryptionKey: string
) {
  try {
    const list = await getItem(key, [], encryptionKey);
    await setItem(key, [...list, value], encryptionKey);
  } catch (e) {
    console.error('error appendItem:', e);
    throw e;
  }
}

export async function prependItem(
  key: string,
  value: any,
  encryptionKey: string
) {
  try {
    const list = await getItem(key, [], encryptionKey);

    await setItem(key, [value, ...list], encryptionKey);
  } catch (e) {
    console.error('error prependItem:', e);
    throw e;
  }
}

export async function removeItem(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('error removeItem:', e);
    throw e;
  }
}

export async function clear() {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error('error clear:', e);
    throw e;
  }
}

export function encryptJson(encryptionKey: string, data: string): string {
  return CryptoJS.AES.encrypt(data, encryptionKey).toString();
}

export function decryptJson(encryptionKey: string, encrypted: string): string {
  try {
    return CryptoJS.AES.decrypt(encrypted, encryptionKey).toString(
      CryptoJS.enc.Utf8
    );
  } catch (e) {
    throw e;
  }
}
