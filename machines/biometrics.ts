import { createModel } from "xstate/lib/model";
import * as LocalAuthentication from 'expo-local-authentication';
import { assign, send, StateFrom } from "xstate";


// --- CREATE MODEL -----------------------------------------------------------
const model = createModel(
  {
    isAvailable : false,
    authTypes   : [],
    isEnrolled  : false,
    status      : null
  },
  {
    events: {
      AUTHENTICATE: () => ({})
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
            console.log('authenticating invoked');
            let res = await LocalAuthentication.authenticateAsync()
            console.log("authenticating result", res)
            return res.success;
          },
          onError: 'failure',
          onDone: {
            target: 'authentication',
            actions: assign({ status: (context, event) => event.data })
          }
        },
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
            meta: 'To use Biometrics, please enroll your fingerprint in your device settings'
          },
          failed: {
            after: {
              // after 3 seconds, transition to available
              3000: { target: '..available' }
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
    actions: {},
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

export function selectIsEnabled(state: State) {
  return state.matches('available');
}