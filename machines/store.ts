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
      SET: (key: string, value: unknown) => ({ key, value }),
      APPEND: (key: string, value: unknown) => ({ key, value }),
      PREPEND: (key: string, value: unknown) => ({ key, value }),
      REMOVE: (key: string, value: string) => ({ key, value }),
      REMOVE_ITEMS: (key: string, values: string[]) => ({ key, values }),
      CLEAR: () => ({}),
      ERROR: (error: Error) => ({ error }),
      STORE_RESPONSE: (response?: unknown, requester?: string) => ({
        response,
        requester,
      }),
      STORE_ERROR: (error: Error, requester?: string) => ({ error, requester }),
    },
  }
);

export const StoreEvents = model.events;

export type StoreResponseEvent = EventFrom<typeof model, 'STORE_RESPONSE'>;

type ForwardedEvent = EventFrom<typeof model> & { requester: string };

export const storeMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SwC4HsBOYB0MUoEsA7KAUSIGMMBPAB0LSIGkxqBiJ0gTQH0AlUgGFSASQBqpACKJQtNLAIMiMkAA9EAFgCsADmxatARgBsAJgDMJ04YDspjcYA0Iaoh1bj2DYdM3DJgAZvLRtjAF8w51RMHDxCEnIqOiUWdlI+PgB5PhU5BSUVdQRjHQDsAPNTYzMdO2MNHR1nVwRDSuwTDwCATi1K7WMA0wio9CxcMCIwDABDeLJKGnoCRlSObn4hUQlpJBA8xRXlPaL3G2xjO26dbVMtIMtmxErPc3MbD0aqm26KrRGQNFxjAprN5oklilWGx0lkcnsDgUToh-AE9H5rqUtBpzNdqk9Wj5sKEDDpuuYQu5DN4AUCcFhYGB8MQoABlMYzGBsCCMHDEABuaAA1jg6dgGUz5uzMJywAgBWgKHMjgBtAIAXVy8kOjEKblCHW6tkMHg+3RsjxciBsDi89wCQ3JmJstLG9LgkpZ0tmXOmGEw2FoABs5gAzTAAW2wYolzJI3tl8qIgqVSjVmoR2qRoCKhh65n05h0gx0FIpBhsBL6pnKNncNxsARNoXCkUBbvFYBmEHYAHFSAAVLX5I561p3AvGPHdBxtDTdAl2c5BbrXXzGLSmHT2V0xTvd9iswfDnXHHMoicXaez8zzgn1Mr2Vdkm64m3mXfjLAHtgAQQACv+pAAHK7LIWajsi459FexYzsYc4LlaCAGAWGjzquU6mFU1TDG2MZdj2bD-gIQGgSe2ZqBeMFTnBN53shDieBuDpBA6bS6IYn7uj+AgALKZBIFGQee0GTteCG3khLTvN02DuOxealAE-z4R235EYIAAypC-vC4EjrqUE+DREmIQSpjkuU9qGDoJq1BoeGjHuGmHgO2SkJsrL-pkwFHsJRmiSZcnobUDpkm+vgErY5zaA6OKNI29TaNx+5Eay7kCDwsLZAFZ5UeOFrYEWCFrnmAR+E0yG-Bc9r3N0G4fMYFIRG2RBoBAcAqGKcQshCyRHKkeVjt4BYGFYKm2ah5jRQ6HQblo3SWc1tSmqlILTMqCSLANqysMNUE-AWVRBD82J+NWs1lJ0i3LUWTUumpLkenGbIcjAB2iTchheO4DR5pu1gOFWhghXWZgfOhDg3KlrmfQVPjvB05hmLi3glCjTjIduWjyT49SlgYm6Ldx8NFEWcnjWYk3uH0M3IbYtUOr4oToc1jY6K1YRAA */
  model.createMachine(
    {
      tsTypes: {} as import('./store.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      id: 'store',
      initial: 'gettingEncryptionKey',
      states: {
        gettingEncryptionKey: {
          invoke: {
            src: 'getEncryptionKey',
          },
          on: {
            KEY_RECEIVED: {
              actions: 'setEncryptionKey',
              target: 'ready',
            },
            ERROR: {
              target: 'generatingEncryptionKey',
            },
          },
        },
        generatingEncryptionKey: {
          invoke: {
            src: 'generateEncryptionKey',
          },
          on: {
            KEY_RECEIVED: {
              actions: 'setEncryptionKey',
              target: 'resettingStorage',
            },
            ERROR: {
              actions: log('Generating encryption key failed'),
            },
          },
        },
        resettingStorage: {
          invoke: {
            src: 'clear',
            onDone: [
              {
                target: 'ready',
              },
            ],
            onError: [
              {
                actions: log('Resetting storage failed'),
              },
            ],
          },
        },
        ready: {
          entry: 'notifyParent',
          invoke: {
            src: 'store',
            id: '_store',
          },
          on: {
            GET: {
              actions: 'forwardStoreRequest',
            },
            SET: {
              actions: 'forwardStoreRequest',
            },
            APPEND: {
              actions: 'forwardStoreRequest',
            },
            PREPEND: {
              actions: 'forwardStoreRequest',
            },
            REMOVE: {
              actions: 'forwardStoreRequest',
            },
            REMOVE_ITEMS: {
              actions: 'forwardStoreRequest',
            },
            CLEAR: {
              actions: 'forwardStoreRequest',
            },
            STORE_RESPONSE: {
              actions: [
                send(
                  (_, event) => model.events.STORE_RESPONSE(event.response),
                  {
                    to: (_, event) => event.requester,
                  }
                ),
                sendUpdate(),
              ],
            },
            STORE_ERROR: {
              actions: send(
                (_, event) => model.events.STORE_ERROR(event.error),
                {
                  to: (_, event) => event.requester,
                }
              ),
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
          encryptionKey: (_, event) => event.key,
        }),
      },

      services: {
        clear,

        store: (context) => (callback, onReceive: Receiver<ForwardedEvent>) => {
          onReceive(async (event) => {
            try {
              let response: unknown;
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
                  await appendItem(
                    event.key,
                    event.value,
                    context.encryptionKey
                  );
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
                  await removeItem(
                    event.key,
                    event.value,
                    context.encryptionKey
                  );
                  response = event.value;
                  break;
                }
                case 'REMOVE_ITEMS': {
                  await removeItems(
                    event.key,
                    event.values,
                    context.encryptionKey
                  );
                  response = event.values;
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
              model.events.ERROR(
                new Error('Could not get keychain credentials.')
              )
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

export async function setItem(
  key: string,
  value: unknown,
  encryptionKey: string
) {
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
  defaultValue: unknown,
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
  value: unknown,
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
  value: unknown,
  encryptionKey: string
) {
  try {
    const list = await getItem(key, [], encryptionKey);
    const newList = Array.isArray(value)
      ? [...value, ...list]
      : [value, ...list];

    await setItem(key, newList, encryptionKey);
  } catch (e) {
    console.error('error prependItem:', e);
    throw e;
  }
}

export async function removeItem(
  key: string,
  value: string,
  encryptionKey: string
) {
  try {
    const data = await AsyncStorage.getItem(key);
    const decrypted = decryptJson(encryptionKey, data);
    const list = JSON.parse(decrypted);
    const vcKeyArray = value.split(':');
    const finalVcKeyArray = vcKeyArray.pop();
    const finalVcKey = vcKeyArray.join(':');
    console.log('finalVcKeyArray', finalVcKeyArray);
    const newList = list.filter((vc: string) => {
      return !vc.includes(finalVcKey);
    });

    await setItem(key, newList, encryptionKey);
  } catch (e) {
    console.error('error removeItem:', e);
    throw e;
  }
}

export async function removeItems(
  key: string,
  values: string[],
  encryptionKey: string
) {
  try {
    const data = await AsyncStorage.getItem(key);
    const decrypted = decryptJson(encryptionKey, data);
    const list = JSON.parse(decrypted);
    const toRemove = new Set(values);
    const newList = list.filter((vc: string) => {
      return !toRemove.has(vc);
    });

    await setItem(key, newList, encryptionKey);
  } catch (e) {
    console.error('error removeItems:', e);
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
    console.error('error decryptJson:', e);
    throw e;
  }
}
