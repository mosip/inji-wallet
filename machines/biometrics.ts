import { createModel } from 'xstate/lib/model';
import * as LocalAuthentication from 'expo-local-authentication';
import { EventFrom, MetaObject, StateFrom } from 'xstate';
import { Platform } from 'react-native';

// ----- CREATE MODEL ---------------------------------------------------------
const model = createModel(
  {
    isAvailable: false,
    authTypes: [],
    isEnrolled: false,
    status: null,
    retry: false,
    error: {},
  },
  {
    events: {
      SET_IS_AVAILABLE: (data: boolean) => ({ data }),
      SET_AUTH: (data: unknown[]) => ({ data }),
      SET_IS_ENROLLED: (data: boolean) => ({ data }),
      SET_STATUS: (data: boolean) => ({ data }),

      AUTHENTICATE: () => ({}),
      RETRY_AUTHENTICATE: () => ({}),
    },
  },
);
// ----------------------------------------------------------------------------

// ----- CREATE MACHINE -------------------------------------------------------
export const biometricsMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    id: 'biometrics',
    context: model.initialContext,
    initial: 'init',
    states: {
      // Initializing biometrics states
      init: {
        invoke: {
          src: LocalAuthentication.hasHardwareAsync,
          onError: 'failure.unavailable',
          onDone: {
            target: 'initAuthTypes',
            actions: ['setIsAvailable'],
          },
        },
      },

      initAuthTypes: {
        invoke: {
          src: LocalAuthentication.supportedAuthenticationTypesAsync,
          onError: 'failure',
          onDone: {
            target: 'initEnrolled',
            actions: ['setAuthTypes'],
          },
        },
      },

      initEnrolled: {
        invoke: {
          src: LocalAuthentication.isEnrolledAsync,
          onError: 'failure',
          onDone: {
            target: 'checking',
            actions: ['setIsEnrolled'],
          },
        },
      },

      // Checks whether we need to proceed if its available otherwise it gets to failure
      checking: {
        always: [
          {
            target: 'available',
            cond: 'checkIfAvailable',
          },
          {
            target: 'failure.unavailable',
            cond: 'checkIfUnavailable',
          },
          {
            target: 'failure.unenrolled',
            cond: 'checkIfUnenrolled',
          },
        ],
      },

      // if available then wait for any event
      available: {
        on: {
          AUTHENTICATE: 'authenticating',
        },
      },

      // authenticating biometrics
      authenticating: {
        invoke: {
          src: () => async () => {
            if (Platform.OS === 'android') {
              await LocalAuthentication.cancelAuthenticate();
            }
            const res = await LocalAuthentication.authenticateAsync({
              promptMessage: 'Biometric Authentication',

              // below can only works for IOS not android
              // disableDeviceFallback: true,
              // fallbackLabel: 'Invalid fingerprint attempts, Please try again.'
            });

            if (res.error) {
              throw new Error(JSON.stringify(res));
            }

            return res.success;
          },
          onError: [
            {
              target: 'failure',
              actions: ['sendFailedEndEvent'],
            },
          ],

          onDone: {
            target: 'authentication',
            actions: ['setStatus'],
          },
        },
        on: {
          AUTHENTICATE: 'authenticating',
        },
      },

      reauthenticating: {
        always: [
          {
            target: 'authenticating',
            cond: 'checkIfAvailable',
          },
          {
            target: 'failure.unenrolled',
          },
        ],
      },

      // checks authentication status
      authentication: {
        always: [
          {
            target: 'success',
            cond: 'isStatusSuccess',
          },
          {
            target: 'failure.failed',
            cond: 'isStatusFail',
          },
        ],
      },

      success: {
        on: {
          SET_IS_AVAILABLE: {
            target: '#biometrics.available',
          },
          AUTHENTICATE: 'authenticating',
        },
      },

      failure: {
        initial: 'error',
        states: {
          unavailable: {
            meta: {
              message: 'errors.unavailable',
            },
          },
          unenrolled: {
            meta: {
              message: 'errors.unenrolled',
            },
            on: {
              RETRY_AUTHENTICATE: {
                //actions: assign({retry: (context, event) => true}),
                actions: ['setRetry'],
                target: [
                  '#biometrics.initEnrolled',
                  '#biometrics.reauthenticating',
                ],
              },
            },
          },
          failed: {
            after: {
              // after 1 seconds, transition to available
              1000: '#biometrics.available',
            },
            meta: {
              message: 'errors.failed',
            },
          },
          error: {
            meta: {
              message: 'errors.generic',
            },
            exit: 'resetError',
          },
        },
        on: {
          AUTHENTICATE: 'authenticating',
        },
      },
    },
  },

  {
    actions: {
      setIsAvailable: model.assign({
        isAvailable: (_, event: SetIsAvailableEvent) => event.data,
      }),

      setAuthTypes: model.assign({
        authTypes: (_, event: SetAuthTypesEvent) => event.data,
      }),

      setIsEnrolled: model.assign({
        isEnrolled: (_, event: SetIsEnrolledEvent) => event.data,
      }),

      setStatus: model.assign({
        status: (_, event: SetStatusEvent) => event.data,
      }),

      setRetry: model.assign({
        retry: () => true,
      }),

      sendFailedEndEvent: model.assign({
        error: (_context, event) => {
          const res = JSON.parse((event.data as Error).message);
          return { res: res, stacktrace: event };
        },
      }),

      resetError: model.assign({
        error: () => null,
      }),
    },
    guards: {
      isStatusSuccess: ctx => ctx.status,
      isStatusFail: ctx => !ctx.status,
      checkIfAvailable: ctx => ctx.isAvailable && ctx.isEnrolled,
      checkIfUnavailable: ctx => !ctx.isAvailable,
      checkIfUnenrolled: ctx => !ctx.isEnrolled,
    },
  },
);

// ----------------------------------------------------------------------------

// ----- TYPES ----------------------------------------------------------------

type SetStatusEvent = EventFrom<typeof model, 'SET_STATUS'>;
type SetIsAvailableEvent = EventFrom<typeof model, 'SET_IS_AVAILABLE'>;
type SetAuthTypesEvent = EventFrom<typeof model, 'SET_AUTH'>;
type SetIsEnrolledEvent = EventFrom<typeof model, 'SET_IS_ENROLLED'>;
type State = StateFrom<typeof biometricsMachine>;

// ----- OTHER EXPORTS --------------------------------------------------------
export const BiometricsEvents = model.events;

export function selectFailMessage(state: State) {
  return Object.values(state.meta)
    .map((m: MetaObject) => m.message)
    .join(', ');
}

export function selectIsEnabled(state: State) {
  return state.matches('available') || state.matches({ failure: 'unenrolled' });
}

export function selectIsAvailable(state: State) {
  return state.matches('available');
}

export function selectIsUnvailable(state: State) {
  return state.matches({ failure: 'unavailable' });
}

export function selectIsUnenrolled(state: State) {
  return state.matches({ failure: 'unenrolled' });
}

export function selectIsSuccess(state: State) {
  return state.matches('success');
}

export function selectError(state: State) {
  return state.matches({ failure: 'error' }) ? selectFailMessage(state) : null;
}

export function selectUnenrolledNotice(state: State) {
  return state.matches({ failure: 'unenrolled' }) && state.context.retry
    ? selectFailMessage(state)
    : null;
}

export function selectErrorResponse(state: State) {
  return state.context.error;
}
