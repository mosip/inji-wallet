import { createModel } from "xstate/lib/model";
import * as LocalAuthentication from 'expo-local-authentication';
import { assign, send, StateFrom } from "xstate";


// --- CREATE MODEL -----------------------------------------------------------
const model = createModel(
  {
    isAvailable : false,
    authTypes   : [],
    isEnrolled  : false,
    status      : null,
    retry       : false,
  },
  {
    events: {
      AUTHENTICATE: () => ({}),
      RETRY_AUTHENTICATE: () => ({})
    }
  }
);
// ----------------------------------------------------------------------------

// --- CREATE MACHINE ---------------------------------------------------------
export const biometricsMachine = model.createMachine(
  {
    id: 'biometrics',
    initial: 'init',
    states: {

      // Initializing biometrics states
      init: {
        invoke: {
          src: LocalAuthentication.hasHardwareAsync,
          onError: 'failure',
          onDone: {
            target: 'initAuthTypes',
            actions: assign({ isAvailable: (context, event) => event.data }),
          }
        }
      },

      initAuthTypes: {
        invoke: {
          src: LocalAuthentication.supportedAuthenticationTypesAsync,
          onError: 'failure',
          onDone: {
            target: 'initEnrolled',
            actions: assign({ authTypes: (context, event) => event.data }),
          }
        }
      },

      initEnrolled: {
        invoke: {
          src: LocalAuthentication.isEnrolledAsync,
          onError: 'failure',
          onDone: {
            target: 'checking',
            actions: assign({ isEnrolled: (context, event) => event.data }),
          }
        }
      },

      // Checks whether we need to proceed if its available otherwise it gets to failure
      checking: {
        always: [
          {
            target: 'available',
            cond: 'checkIfAvailable'
          },
          {
            target: 'failure.unavailable',
            cond: 'checkIfUnavailable'
          },
          {
            target: 'failure.unenrolled',
            cond: 'checkIfUnenrolled'
          }
        ]
      },


      // if available then wait for any event
      available: {
        on: {
          AUTHENTICATE: 'authenticating'
        }
      },

      // authenticating biometrics
      authenticating: {
        invoke: {
          src: () => async () => {
            // console.log('[BIOMETRIC_MACHINE] authenticating invoked');
            let res = await LocalAuthentication.authenticateAsync({
              promptMessage: 'Biometric Authentication',
            })
            // console.log("[BIOMETRIC_MACHINE] authenticating result", res)
            return res.success;
          },
          onError: 'failure',
          onDone: {
            target: 'authentication',
            actions: assign({ status: (context, event) => event.data })
          }
        },
      },

      reauthenticating: {
        always: [
          {
            target: 'authenticating',
            cond: 'checkIfAvailable'
          },
          {
            target: 'failure.unenrolled'
          }
        ]
      },

      // checks authentication status
      authentication: {
        always: [
          {
            target: 'success',
            cond: ctx => ctx.status
          },
          {
            target: 'failure.failed',
            cond: ctx => !ctx.status
          }
        ]
      },

      success: {
        meta: 'Success authentication with Biometrics',
      },

      failure: {
        initial: 'error',
        states: {
          unavailable: {
            meta: 'Device does not support Biometrics'
          },
          unenrolled: {
            meta: 'To use Biometrics, please enroll your fingerprint in your device settings',
            on: {
              RETRY_AUTHENTICATE: {
                actions: assign({retry: (context, event) => true}),
                target: [
                  '#biometrics.initEnrolled',
                  '#biometrics.reauthenticating'
                ]
              }
            }
          },
          failed: {
            after: {
              // after 1 seconds, transition to available
              1000: { target: '#biometrics.available' }
            },
            meta: 'Failed to authenticate with Biometrics'
          },
          error: {
            meta: 'There seems to be an error in Biometrics authentication'
          },
        }
      }

    }
  },

  {
    actions: {
    },
    guards: {
      checkIfAvailable: ctx => ctx.isAvailable && ctx.isEnrolled,
      checkIfUnavailable: ctx => !ctx.isAvailable,
      checkIfUnenrolled: ctx => !ctx.isEnrolled
    }
  }

);

// ----------------------------------------------------------------------------


// --- OTHER EXPORTS ----------------------------------------------------------
export const BiometricsEvents = model.events;

type State = StateFrom<typeof biometricsMachine>;

export function selectFailMessage(state: State) {
  return Object.values(state.meta).join(', ');
}

export function selectIsEnabled(state: State) {
  return state.matches('available') ||
        state.matches({ failure: 'unenrolled' });
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
  return state.matches({failure: 'error'}) ? selectFailMessage(state) : '';
}

export function selectUnenrolledNotice(state: State) {
  // console.log("the unenrolled context is?", state.context)
  return state.matches({ failure: 'unenrolled' }) && state.context.retry ? selectFailMessage(state) : '';
}