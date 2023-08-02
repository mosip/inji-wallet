import * as Keychain from 'react-native-keychain';
import CryptoJS from 'crypto-js';
import Storage from '../shared/storage';
import binaryToBase64 from 'react-native/Libraries/Utilities/binaryToBase64';
import {
  EventFrom,
  Receiver,
  sendParent,
  send,
  sendUpdate,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { generateSecureRandom } from 'react-native-securerandom';
import { log } from 'xstate/lib/actions';
import {
  VC_ITEM_STORE_KEY_REGEX,
  MY_VCS_STORE_KEY,
  isIOS,
} from '../shared/constants';
import SecureKeystore from 'react-native-secure-keystore';
import { isCustomSecureKeystore } from '../shared/cryptoutil/cryptoUtil';

export const ENCRYPTION_ID = 'c7c22a6c-9759-4605-ac88-46f4041d863d';
const vcKeyRegExp = new RegExp(VC_ITEM_STORE_KEY_REGEX);

const model = createModel(
  {
    encryptionKey: '',
    isTampered: false as boolean,
  },
  {
    events: {
      KEY_RECEIVED: (key: string) => ({ key }),
      READY: () => ({}),
      TRY_AGAIN: () => ({}),
      IGNORE: () => ({}),
      GET: (key: string) => ({ key }),
      DECRYPT_ERROR: () => ({}),
      SET: (key: string, value: unknown) => ({ key, value }),
      APPEND: (key: string, value: unknown) => ({ key, value }),
      PREPEND: (key: string, value: unknown) => ({ key, value }),
      UPDATE: (key: string, value: string) => ({ key, value }),
      REMOVE: (key: string, value: string) => ({ key, value }),
      REMOVE_VC_METADATA: (key: string, value: string) => ({ key, value }),
      REMOVE_ITEMS: (key: string, values: string[]) => ({ key, values }),
      CLEAR: () => ({}),
      ERROR: (error: Error) => ({ error }),
      STORE_RESPONSE: (response?: unknown, requester?: string) => ({
        response,
        requester,
      }),
      STORE_ERROR: (error: Error, requester?: string) => ({ error, requester }),
      TAMPERED_VC: () => ({}),
      RESET_IS_TAMPERED: () => ({}),
    },
  }
);

export const StoreEvents = model.events;

export type StoreResponseEvent = EventFrom<typeof model, 'STORE_RESPONSE'>;

type ForwardedEvent = EventFrom<typeof model> & { requester: string };

export const storeMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SwC4HsBOYB0MUoEsA7KAUSIGMMBPAB0LSIGkxqBiJ0gTQH0AlUgGFSASQBqpACIBtAAwBdRKFppYBBkSUgAHogBMADj3YArAYDMAdnMBOQ5csA2AIzOTAGhDVErt9kcmzrKGznqyBgYm5gC+0Z6omDh4hCTkVHQaLOykfHwA8nxyikggKmoaWroIhsZmVrb2Tq4eXog2AaY2ACyWdjbBhgbOsfHoWLhgRGAYAIYpZJQ09ASMWRzc-EKiEjIKWmXqK5olVdYG2G4OoeYmlgb9ep7eCDYmjtgWJnp6zjaWvo49CMQAlxjAprN5mklplWGwcvlCnsSgcKidECYuu8vs4uuYAtZHBYDE9EJETKY3OZZLcTJi9OYgXEQWMcFhYGB8MQoABlMYzGBsCCMHDEABuaAA1jhQWy4Jz5nzMAKwAhxWgKHMjkUivtVIdGJUfLI-thZFjMRYrJaSa0Xu1sHo6V0TQFHHiTMDZdh2QruUrZoLphhMNhaAAbOYAM0wAFtsN7fVySAGVWqiBLNRodcjlPq0aAqt1jOFgrJbI47JYfqSEAZrJ0uq9ukMotYvayfWAZhB2ABxUgAFV1KPzRyNCFCJlk-kcljxLibekcjlrQVkM-M+IXRK6PxXHcSXZ77B5Q5HefK4-Rk6dM5X8-xuLsK9r-S6F2sNKaBmCRkP4xYCebAAIIAApgaQAByuzFJeBrHIWPh3rOj6Li+q52r+5wbu0PzmJEhjlgBcrAWBAiQTBF6lGOho3lO95zguz7Lphzz-M4HxYs4kRuE6jJdCRx69mwAgALJ5BI1GoteSG3tOqHMUur52i4FJEno873L8dw9EJQEieJkmkDwYiCDwYlDiBkggYOIHSbRiE6Mh5icdWPzOI4shOG2taBDYlI2PiNiRDc7SesyibdoZpASRIPAiIOsU8g5V50XJDGKU+ylsYge7mNgNwmDY-R3PO4ROvp0XsIIAAypAgUicE0WlTlVJlD5KRhtaMpYFx2E2ZxDBulhVcBPKDgUJkCDyYF5FBZ6pQhE5TsY87LgyFjdO0tZhB+5hdDxJrlnoeGyI4Y0iRNU08AiBRLQWzm3nO-jFS4tgVs4BG1kM2BNq4YRzncDJNrEzJEGgEBwFosp6q1E4ALS5QgSNCck3LQhkRxZHDy03nua7ro6056IdVineWo2RZ24LTFqqSLFjqysLjj1VFixj1hEXldG8XnBG+bz+GVh0hUM-xMqMR5Joq-IwKzslPXYM5dE2+IbtS-Q2G+-zYJYZhfUVNjOJYJqXc88Fs8heKFYb5UmtYhOyJxTYhdWxuVu6EWxEAA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./store.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      id: 'store',
      initial: !isCustomSecureKeystore()
        ? 'gettingEncryptionKey'
        : 'checkEncryptionKey',
      states: {
        checkEncryptionKey: {
          invoke: {
            src: 'hasAndroidEncryptionKey',
          },
          on: {
            READY: {
              target: 'ready',
            },
            ERROR: {
              target: 'generatingEncryptionKey',
            },
          },
        },
        gettingEncryptionKey: {
          invoke: {
            src: 'getEncryptionKey',
          },
          on: {
            KEY_RECEIVED: {
              actions: ['setEncryptionKey', 'logKey'],
              target: 'ready',
            },
            ERROR: {
              target: 'checkStorageInitialisation',
            },
          },
        },
        checkStorageInitialisation: {
          invoke: {
            src: 'checkStorageInitialisedOrNot',
          },
          on: {
            ERROR: {
              target: 'failedReadingKey',
              actions: sendParent('ERROR'),
            },
            READY: {
              target: 'generatingEncryptionKey',
            },
          },
        },
        failedReadingKey: {
          on: {
            TRY_AGAIN: {
              target: 'gettingEncryptionKey',
            },
            IGNORE: {
              target: 'generatingEncryptionKey',
            },
          },
        },
        generatingEncryptionKey: {
          invoke: {
            src: 'generateEncryptionKey',
          },
          on: {
            KEY_RECEIVED: [
              {
                cond: 'isCustomSecureKeystore',
                target: 'ready',
              },
              {
                actions: 'setEncryptionKey',
                target: 'resettingStorage',
              },
            ],

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
            UPDATE: {
              actions: 'forwardStoreRequest',
            },
            REMOVE: {
              actions: 'forwardStoreRequest',
            },
            REMOVE_VC_METADATA: {
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
              actions: [
                send((_, event) => model.events.STORE_ERROR(event.error), {
                  to: (_, event) => event.requester,
                }),
                sendUpdate(),
              ],
            },
            DECRYPT_ERROR: {
              actions: sendParent('DECRYPT_ERROR'),
            },
            TAMPERED_VC: {
              actions: ['setIsTamperedVc'],
            },
            RESET_IS_TAMPERED: {
              actions: ['resetIsTamperedVc'],
            },
          },
        },
      },
    },
    {
      actions: {
        setIsTamperedVc: model.assign({
          isTampered: () => true,
        }),

        resetIsTamperedVc: model.assign({
          isTampered: () => false,
        }),

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
        hasAndroidEncryptionKey: () => async (callback) => {
          const hasSetCredentials = SecureKeystore.hasAlias(ENCRYPTION_ID);
          if (hasSetCredentials) {
            callback(model.events.READY());
          } else {
            callback(
              model.events.ERROR(
                new Error('Could not get the android Key alias')
              )
            );
          }
        },
        checkStorageInitialisedOrNot: () => async (callback) => {
          const isDirectoryExist = await Storage.isVCStorageInitialised();
          if (!isDirectoryExist) {
            callback(model.events.READY());
          } else {
            callback(
              model.events.ERROR(
                new Error(
                  'vc directory exists and decryption key is not available'
                )
              )
            );
          }
        },

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
                case 'UPDATE': {
                  await updateItem(
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
                case 'REMOVE_VC_METADATA': {
                  await removeVCMetaData(
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
              if (e.message === 'Data is tampered') {
                callback(model.events.TAMPERED_VC());
              } else if (
                e.message.includes('JSON') ||
                e.message.includes('decrypt')
              ) {
                callback(model.events.DECRYPT_ERROR());
                sendUpdate();
              } else {
                console.error(e);
                callback(model.events.STORE_ERROR(e, event.requester));
              }
            }
          });
        },
        getEncryptionKey: () => async (callback) => {
          const existingCredentials = await Keychain.getGenericPassword();
          if (existingCredentials) {
            console.log('Credentials successfully loaded for user');
            callback(model.events.KEY_RECEIVED(existingCredentials.password));
          } else {
            console.log('Credentials failed to load for user');
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
          if (!isCustomSecureKeystore()) {
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
          } else {
            SecureKeystore.generateKey(ENCRYPTION_ID);
            callback(model.events.KEY_RECEIVED(''));
          }
        },
      },

      guards: {
        isCustomSecureKeystore: () => isCustomSecureKeystore(),
      },
    }
  );

export async function setItem(
  key: string,
  value: unknown,
  encryptionKey: string
) {
  try {
    const data = JSON.stringify(value);
    const encryptedData = encryptJson(encryptionKey, data);
    await Storage.setItem(key, encryptedData, encryptionKey);
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
    const data = await Storage.getItem(key, encryptionKey);
    if (data != null) {
      const decryptedData = decryptJson(encryptionKey, data);
      return JSON.parse(decryptedData);
    }
    if (data === null && vcKeyRegExp.exec(key)) {
      await removeItem(key, data, encryptionKey);
      throw new Error('Data is tampered');
    } else {
      return defaultValue;
    }
  } catch (e) {
    if (e.message.includes('Data is tampered')) {
      throw e;
    }
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
export async function updateItem(
  key: string,
  value: string,
  encryptionKey: string
) {
  try {
    const list = await getItem(key, [], encryptionKey);
    const newList = [
      value,
      ...list.map((item) => {
        const vc = item.split(':');
        if (vc[3] !== value.split(':')[3]) {
          vc[4] = 'false';
          return vc.join(':');
        }
      }),
    ].filter((value) => value != undefined && value !== null);

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
    if (value === null && vcKeyRegExp.exec(key)) {
      await Storage.removeItem(key);
      await removeVCMetaData(MY_VCS_STORE_KEY, key, encryptionKey);
    } else {
      const data = await Storage.getItem(key, encryptionKey);
      const decryptedData = decryptJson(encryptionKey, data);
      const list = JSON.parse(decryptedData);
      const vcKeyArray = value.split(':');
      const finalVcKeyArray = vcKeyArray.pop();
      const finalVcKey = vcKeyArray.join(':');
      //console.log('finalVcKeyArray', finalVcKeyArray);
      const newList = list.filter((vc: string) => {
        return !vc.includes(finalVcKey);
      });

      await setItem(key, newList, encryptionKey);
      await Storage.removeItem(value);
    }
  } catch (e) {
    console.error('error removeItem:', e);
    throw e;
  }
}

export async function removeVCMetaData(
  key: string,
  value: string,
  encryptionKey: string
) {
  try {
    const data = await Storage.getItem(key, encryptionKey);
    const decryptedData = decryptJson(encryptionKey, data);
    const list = JSON.parse(decryptedData);
    const newList = list.filter((vc: string) => {
      return !vc.includes(value);
    });

    await setItem(key, newList, encryptionKey);
  } catch (e) {
    console.error('error remove VC metadata:', e);
    throw e;
  }
}

export async function removeItems(
  key: string,
  values: string[],
  encryptionKey: string
) {
  try {
    const data = await Storage.getItem(key, encryptionKey);
    const decryptedData = decryptJson(encryptionKey, data);
    const list = JSON.parse(decryptedData);
    const newList = list.filter(function (vc: string) {
      return !values.find(function (vcKey: string) {
        const vcKeyArray = vcKey.split(':');
        const finalVcKeyArray = vcKeyArray.pop();
        const finalVcKey = vcKeyArray.join(':');
        return vc.includes(finalVcKey);
      });
    });

    await setItem(key, newList, encryptionKey);
  } catch (e) {
    console.error('error removeItems:', e);
    throw e;
  }
}

export async function clear() {
  try {
    console.log('clearing entire storage');
    await Storage.clear();
  } catch (e) {
    console.error('error clear:', e);
    throw e;
  }
}

export function encryptJson(encryptionKey: string, data: string): string {
  if (!isCustomSecureKeystore()) {
    return CryptoJS.AES.encrypt(data, encryptionKey).toString();
  }
  return SecureKeystore.encryptData(ENCRYPTION_ID, data);
}

export function decryptJson(
  encryptionKey: string,
  encryptedData: string
): string {
  try {
    if (!isCustomSecureKeystore()) {
      return CryptoJS.AES.decrypt(encryptedData, encryptionKey).toString(
        CryptoJS.enc.Utf8
      );
    }
    return SecureKeystore.decryptData(ENCRYPTION_ID, encryptedData);
  } catch (e) {
    console.error('error decryptJson:', e);
    throw e;
  }
}

type State = StateFrom<typeof storeMachine>;

export function selectIsTampered(state: State) {
  return state.context.isTampered;
}
