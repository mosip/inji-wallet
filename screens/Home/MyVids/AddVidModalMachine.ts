import { TextInput } from 'react-native';
import {
  DoneInvokeEvent,
  ErrorPlatformEvent,
  EventFrom,
  sendParent,
  StateFrom,
} from 'xstate';
import { log } from 'xstate/lib/actions';
import { createModel } from 'xstate/lib/model';
import { BackendResponseError, request } from '../../../shared/request';
import { VID_ITEM_STORE_KEY } from '../../../shared/constants';

const model = createModel(
  {
    uinInputRef: null as TextInput,
    uin: '',
    otp: '',
    uinError: '',
    otpError: '',
    transactionId: '',
    requestId: '',
  },
  {
    events: {
      INPUT_UIN: (uin: string) => ({ uin }),
      INPUT_OTP: (otp: string) => ({ otp }),
      VALIDATE_UIN: () => ({}),
      READY: (uinInputRef: TextInput) => ({ uinInputRef }),
      DISMISS: () => ({}),
    },
  }
);

export const AddVidModalEvents = model.events;

type ReadyEvent = EventFrom<typeof model, 'READY'>;
type InputUinEvent = EventFrom<typeof model, 'INPUT_UIN'>;
type InputOtpEvent = EventFrom<typeof model, 'INPUT_OTP'>;

export const AddVidModalMachine = model.createMachine(
  {
    id: 'AddVidModal',
    context: model.initialContext,
    initial: 'acceptingUinInput',
    states: {
      acceptingUinInput: {
        id: 'acceptingUinInput',
        entry: ['setTransactionId', 'clearOtp'],
        initial: 'rendering',
        states: {
          rendering: {
            on: {
              READY: {
                target: 'focusing',
                actions: ['setUinInputRef'],
              },
            },
          },
          focusing: {
            // delay on first render to show keyboard
            after: {
              100: 'idle',
            },
          },
          idle: {
            entry: ['focusUinInput'],
            on: {
              INPUT_UIN: {
                actions: ['setUin'],
              },
              VALIDATE_UIN: [
                { cond: 'isEmptyUin', target: 'invalid.empty' },
                {
                  cond: 'isWrongUinFormat',
                  target: 'invalid.format',
                },
                { target: 'requestingOtp' },
              ],
            },
          },
          invalid: {
            entry: ['focusUinInput'],
            on: {
              INPUT_UIN: {
                target: 'idle',
                actions: ['setUin', 'clearUinError'],
              },
              VALIDATE_UIN: [
                { cond: 'isEmptyUin', target: '.empty' },
                {
                  cond: 'isWrongUinFormat',
                  target: '.format',
                },
                { target: 'requestingOtp' },
              ],
            },
            states: {
              empty: {
                entry: ['setUinErrorEmpty'],
              },
              format: {
                entry: ['setUinErrorWrongFormat'],
              },
              backend: {},
            },
          },
          requestingOtp: {
            invoke: {
              src: 'requestOtp',
              onDone: '#acceptingOtpInput',
              onError: {
                target: 'invalid.backend',
                actions: ['setUinError'],
              },
            },
          },
        },
        on: {
          DISMISS: {
            actions: [sendParent('DISMISS')],
          },
        },
      },
      acceptingOtpInput: {
        id: 'acceptingOtpInput',
        entry: ['clearOtp'],
        on: {
          INPUT_OTP: {
            target: 'requestingCredential',
            actions: ['setOtp'],
          },
          DISMISS: '#acceptingUinInput.idle',
        },
      },
      requestingCredential: {
        invoke: {
          src: 'requestCredential',
          onDone: {
            target: 'requestSuccessful',
            actions: ['setRequestId'],
          },
          onError: [
            {
              cond: 'isUinInvalid',
              target: '#acceptingUinInput.invalid',
              actions: ['setUinError'],
            },
            {
              target: 'acceptingOtpInput',
              actions: ['setOtpError'],
            },
          ],
        },
      },
      requestSuccessful: {
        on: {
          DISMISS: 'done',
        },
      },
      done: {
        type: 'final',
        data: (context) => VID_ITEM_STORE_KEY(context.uin, context.requestId),
      },
    },
  },
  {
    actions: {
      setUin: model.assign({
        uin: (_, event: InputUinEvent) => event.uin,
      }),

      setOtp: model.assign({
        otp: (_, event: InputOtpEvent) => event.otp,
      }),

      setTransactionId: model.assign({
        transactionId: () => String(new Date().valueOf()).substring(3, 13),
      }),

      setRequestId: model.assign({
        requestId: (_, event: any) => (event as DoneInvokeEvent<string>).data,
      }),

      setUinError: model.assign({
        uinError: (_, event: any) => (event as ErrorPlatformEvent).data.message,
      }),

      clearUinError: model.assign({ uinError: '' }),

      setUinErrorEmpty: model.assign({
        uinError: 'The UIN cannot be empty',
      }),

      setUinErrorWrongFormat: model.assign({
        uinError: 'The UIN format is incorrect',
      }),

      setOtpError: model.assign({
        otpError: (_, event: any) => (event as ErrorPlatformEvent).data.message,
      }),

      setUinInputRef: model.assign({
        uinInputRef: (_, event: ReadyEvent) => event.uinInputRef,
      }),

      clearOtp: model.assign({ otp: '' }),

      focusUinInput: (context) => context.uinInputRef.focus(),
    },

    services: {
      requestOtp: async (context) => {
        return request('POST', '/req/otp', {
          individualId: context.uin,
          individualIdType: 'UIN',
          otpChannel: ['EMAIL', 'PHONE'],
          transactionID: context.transactionId,
        });
      },

      requestCredential: async (context) => {
        const response = await request('POST', '/credentialshare/request', {
          individualId: context.uin,
          otp: context.otp,
          transactionID: context.transactionId,
        });
        return response.response.requestId;
      },
    },

    guards: {
      isEmptyUin: ({ uin }) => !uin || !uin.length,

      isWrongUinFormat: ({ uin }) => !/^[0-9]{10}$/.test(uin),

      isUinInvalid: (_, event: any) =>
        ['IDA-MLC-009', 'RES-SER-29', 'IDA-MLC-018'].includes(
          (event as BackendResponseError).name
        ),

      // isOtpInvalid: (_, event: any) =>
      //   (event as BackendResponseError).name === 'RES-SER-422',
    },
  }
);

type State = StateFrom<typeof AddVidModalMachine>;

export function selectUin(state: State) {
  return state.context.uin;
}

export function selectUinInputRef(state: State) {
  return state.context.uinInputRef;
}

export function selectUinError(state: State) {
  return state.context.uinError;
}

export function selectOtpError(state: State) {
  return state.context.otpError;
}

export function selectIsAcceptingUinInput(state: State) {
  return state.matches('acceptingUinInput');
}

export function selectIsInvalid(state: State) {
  return state.matches('acceptingUinInput.invalid');
}

export function selectIsAcceptingOtpInput(state: State) {
  return state.matches('acceptingOtpInput');
}

export function selectIsRequestingOtp(state: State) {
  return state.matches('acceptingUinInput.requestingOtp');
}

export function selectIsRequestingCredential(state: State) {
  return state.matches('requestingCredential');
}

export function selectIsRequestSuccessful(state: State) {
  return state.matches('requestSuccessful');
}
