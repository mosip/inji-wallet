import { TextInput } from 'react-native';
import {
  assign,
  DoneInvokeEvent,
  ErrorPlatformEvent,
  EventFrom,
  sendParent,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { BackendResponseError, request } from '../../../shared/request';
import { VC_ITEM_STORE_KEY } from '../../../shared/constants';
import { VcIdType } from '../../../types/vc';
import i18n from '../../../i18n';

const model = createModel(
  {
    idInputRef: null as TextInput,
    id: '',
    idType: 'UIN' as VcIdType,
    idError: '',
    otp: '',
    otpError: '',
    transactionId: '',
    requestId: '',
  },
  {
    events: {
      INPUT_ID: (id: string) => ({ id }),
      INPUT_OTP: (otp: string) => ({ otp }),
      VALIDATE_INPUT: () => ({}),
      READY: (idInputRef: TextInput) => ({ idInputRef }),
      DISMISS: () => ({}),
      SELECT_ID_TYPE: (idType: VcIdType) => ({ idType }),
    },
  }
);

export const AddVcModalEvents = model.events;

export const AddVcModalMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEEIQGoGMCyB7CAhgDYB0BmmYADgC4CWAdlAJITMNUCuNJATmAwhhejKAGIASgFFkAEQCaiUFVyw69XAyUgAHogC0ARgAsATgDMJAEynjhgBzmArE-v2AbDYA0IAJ4GrAHZ3EkCnKxMrc0NDc1NA+ycAXySfVAwcfGIyCmp6JlZ2Lh4AM1xMTjUmMR1YGgIaMDISxt4ACkMABk6ASjF0rDxCUnJKWlFCjm4SMoqqqG0VNQ0tJF0DWM6QwOjXQydjYyDbH38EIycQ+M6PI6t7TsNTdxS0tEGskdzxgrYpnjoECIYDEzAAcgAFACqABUAPrMWSLVTqOiabR6c6GdxOQIkRydcJRQnudweU6IezGEjGezxKxRQJPTamV4gAaZYY5Mb5Fh-YokQHAsToZAAGURyBhUgRkNhyOWaNWoExRisLmsuPMgSCgUC8XM9gpCCCThI5huNkNpme2qc5jZHKG2VGeQm-OmQpBAGUpGKpABheGIuEw+QQqQK1Hotaq-b2QwkTqmVzBTqBQnmdXGoyGKyheI6xnmYzmMmGR3vTku768yYCxgAN2IgNBcuDSLWS2jyvWWM6ZdCA6c6eMYQtuJz8WshuxHhcVkzDtS7Krzq+PPdRU9DGbRFboolsilMvB0JhUZWGIMpcs+1METHycSnWMxsfSdcZfM2pLFsNlYZOu3Jur824AruLYQGIvr+kGCKyKG4aRl2KJXrGGyEp0JCmPeOKJP+ZbGu4pg4XSOp0q+jgJKyK5Op8IE-Hy4F8GAACOnBwLyADyNBUGIECaE0Ta4AA1k09Fcq6TH1tM-AcVxoi8VQCAiZgDRKgA2p0AC6l5Kte-ZuNYpJ6par6XIExr2DYNI2bigRmDqJKAR8Um1lu-ysQpdRKXxYjCLwuC8CQVBEA0ZS8AAtiQkk1puYFefJnG+Uwymqbu5QaZo2l6ahioxiqBjxPYJAxFseZpnY0TGmYIROA43QPAOpkvHRa4MdJdYejQYiyMw3rYAN3r6YVfb6MY7jUtiWYllY7jYpE7jWWEZVPPcTILQ1FbtUBnUeWlfHgW255wtxMIQqNvZxnE1Iph4i4Wo8LXGqYhJJs1RwPj+32udWG6gVAynHf1g3DVdhkXDsSYJJ0VhmAyDi0rVGopqYVLww8jkmMubx7VyyWKUwAb8EIDD0MQAlCYKmXibFHUE+xKW8iTkACBTRAZY2WUrLlEMYVi2LYfc+xmDaJhklYxpdBaoSixE7gDjcxjJLtbnZITqVQKzZMcwFvBBSFYURcFMVxaQmss6T7N0MQXM81pun80VWKHImMS0sccPuHqUt+IgMTBGVDKLvquLUcYKQrgw+BwNo5uMd1LH8IIwiiM743YvqJBTQ+GZPDstJvv75zzZYYQKz9pYPG1ePqwDMk9TM5SVOn+U9pDsR5kOA4pjirjzU4OZl6E4QzbdhpbH9wFdZ5DZAmAGdxqW1JRM4Nrat0JimMaTJkfSwTGDcWY7XX-2J3PO57oCJBgFFtBnMoaEGQL+g7Hi9g6p49oq735jSzZT8jgEw+1worSOatz6z0Sg2SC+4IDN2ig0JeBhgj5hcIaT++wnhUiNCXEseILQ2TcGEDMP5T6rnxvFQGskILXwQQAI3IOJQQKDzgkUTJmDwOJFY4gsMaEcpEGoPBMGObU7hojT32glZiXkmxQTYW-DwJAMEkOwejZGJdJpAO1HSQ4U1QFSPcjI2h3lmZ+SoIo8qH9nC0gahYBIpJiLahwg+H25FXxxFrpQ+uF8YHcCsWQnOCN84GiLjmUs2wx5mGEdjIx1CmLA3+FYzwpEggPEmgaMueCzj6jxJ7A4r4VbagfPEi2TMiba2tuTW2RArGTXzA4cWJIdieGlo8UqEQDgYPTAQspJBBIMEXu3dCLt9B0ksIrRwtgDi4RtO00scsDiHATCWDJZTAlBGCXnR4YSqQ5kEaPLphgdjpntFSKOSQgA */
  model.createMachine(
    {
      tsTypes: {} as import('./AddVcModalMachine.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      id: 'AddVcModal',
      initial: 'acceptingIdInput',
      states: {
        acceptingIdInput: {
          entry: ['setTransactionId', 'clearOtp'],
          initial: 'rendering',
          states: {
            rendering: {
              on: {
                READY: {
                  actions: 'setIdInputRef',
                  target: 'focusing',
                },
              },
            },
            focusing: {
              after: {
                '100': {
                  description:
                    'Small delay to properly show the keyboard when focusing input.',
                  target: 'idle',
                },
              },
            },
            idle: {
              entry: 'focusInput',
              on: {
                INPUT_ID: {
                  actions: 'setId',
                },
                VALIDATE_INPUT: [
                  {
                    cond: 'isEmptyId',
                    target: '#AddVcModal.acceptingIdInput.invalid.empty',
                  },
                  {
                    cond: 'isWrongIdFormat',
                    target: '#AddVcModal.acceptingIdInput.invalid.format',
                  },
                  {
                    target: 'requestingOtp',
                  },
                ],
                SELECT_ID_TYPE: {
                  actions: ['setIdType', 'clearId'],
                },
              },
            },
            invalid: {
              entry: 'focusInput',
              states: {
                empty: {
                  entry: 'setIdErrorEmpty',
                },
                format: {
                  entry: 'setIdErrorWrongFormat',
                },
                backend: {},
              },
              on: {
                INPUT_ID: {
                  actions: ['setId', 'clearIdError'],
                  target: 'idle',
                },
                VALIDATE_INPUT: [
                  {
                    cond: 'isEmptyId',
                    target: '.empty',
                  },
                  {
                    cond: 'isWrongIdFormat',
                    target: '.format',
                  },
                  {
                    target: 'requestingOtp',
                  },
                ],
                SELECT_ID_TYPE: {
                  actions: ['setIdType', 'clearId'],
                  target: 'idle',
                },
              },
            },
            requestingOtp: {
              invoke: {
                src: 'requestOtp',
                onDone: [
                  {
                    target: '#AddVcModal.acceptingOtpInput',
                  },
                ],
                onError: [
                  {
                    actions: 'setIdBackendError',
                    target: '#AddVcModal.acceptingIdInput.invalid.backend',
                  },
                ],
              },
            },
          },
          on: {
            DISMISS: {
              actions: 'forwardToParent',
            },
          },
        },
        acceptingOtpInput: {
          entry: 'clearOtp',
          on: {
            INPUT_OTP: {
              actions: 'setOtp',
              target: 'requestingCredential',
            },
            DISMISS: {
              target: '#AddVcModal.acceptingIdInput.idle',
            },
          },
        },
        requestingCredential: {
          invoke: {
            src: 'requestCredential',
            onDone: [
              {
                actions: 'setRequestId',
                target: 'done',
              },
            ],
            onError: [
              {
                actions: 'setIdBackendError',
                cond: 'isIdInvalid',
                target: '#AddVcModal.acceptingIdInput.invalid.backend',
              },
              {
                actions: 'setOtpError',
                target: 'acceptingOtpInput',
              },
            ],
          },
        },
        done: {
          type: 'final',
          data: (context) => VC_ITEM_STORE_KEY(context),
        },
      },
    },
    {
      actions: {
        forwardToParent: sendParent('DISMISS'),

        setId: model.assign({
          id: (_context, event) => event.id,
        }),

        setIdType: model.assign({
          idType: (_context, event) => event.idType,
        }),

        setOtp: model.assign({
          otp: (_context, event) => event.otp,
        }),

        setTransactionId: assign({
          transactionId: () => String(new Date().valueOf()).substring(3, 13),
        }),

        setRequestId: assign({
          requestId: (_context, event) =>
            (event as DoneInvokeEvent<string>).data,
        }),

        setIdBackendError: assign({
          idError: (context, event) => {
            const message = (event as ErrorPlatformEvent).data.message;
            const ID_ERRORS_MAP = {
              'UIN invalid': 'invalidUin',
              'VID invalid': 'invalidVid',
              'Invalid Input Parameter - individualId':
                context.idType === 'UIN' ? 'invalidUin' : 'invalidVid',
            };
            return ID_ERRORS_MAP[message]
              ? i18n.t(`errors.backend.${ID_ERRORS_MAP[message]}`, {
                  ns: 'AddVcModal',
                })
              : message;
          },
        }),

        clearId: model.assign({ id: '' }),

        clearIdError: model.assign({ idError: '' }),

        setIdErrorEmpty: model.assign({
          idError: () => i18n.t('errors.input.empty', { ns: 'AddVcModal' }),
        }),

        setIdErrorWrongFormat: model.assign({
          idError: () =>
            i18n.t('errors.input.invalidFormat', { ns: 'AddVcModal' }),
        }),

        setOtpError: assign({
          otpError: (_context, event) => {
            const message = (event as ErrorPlatformEvent).data.message;
            const OTP_ERRORS_MAP = {
              'OTP is invalid': 'invalidOtp',
            };
            return OTP_ERRORS_MAP[message]
              ? i18n.t(`errors.backend.${OTP_ERRORS_MAP[message]}`, {
                  ns: 'AddVcModal',
                })
              : message;
          },
        }),

        setIdInputRef: model.assign({
          idInputRef: (_context, event) => event.idInputRef,
        }),

        clearOtp: assign({ otp: '' }),

        focusInput: (context) => context.idInputRef.focus(),
      },

      services: {
        requestOtp: async (context) => {
          return request('POST', '/req/otp', {
            individualId: context.id,
            individualIdType: context.idType,
            otpChannel: ['EMAIL', 'PHONE'],
            transactionID: context.transactionId,
          });
        },

        requestCredential: async (context) => {
          const response = await request('POST', '/credentialshare/request', {
            individualId: context.id,
            individualIdType: context.idType,
            otp: context.otp,
            transactionID: context.transactionId,
          });
          return response.response.requestId;
        },
      },

      guards: {
        isEmptyId: ({ id }) => !id || !id.length,

        isWrongIdFormat: ({ id }) => !/^\d{10,16}$/.test(id),

        isIdInvalid: (_context, event: unknown) =>
          ['IDA-MLC-009', 'RES-SER-29', 'IDA-MLC-018'].includes(
            (event as BackendResponseError).name
          ),
      },
    }
  );

type State = StateFrom<typeof AddVcModalMachine>;

export function selectId(state: State) {
  return state.context.id;
}

export function selectIdType(state: State) {
  return state.context.idType;
}

export function selectIdInputRef(state: State) {
  return state.context.idInputRef;
}

export function selectIdError(state: State) {
  return state.context.idError;
}

export function selectOtpError(state: State) {
  return state.context.otpError;
}

export function selectIsAcceptingIdInput(state: State) {
  return state.matches('acceptingIdInput');
}

export function selectIsInvalid(state: State) {
  return state.matches('acceptingIdInput.invalid');
}

export function selectIsAcceptingOtpInput(state: State) {
  return state.matches('acceptingOtpInput');
}

export function selectIsRequestingOtp(state: State) {
  return state.matches('acceptingIdInput.requestingOtp');
}

export function selectIsRequestingCredential(state: State) {
  return state.matches('requestingCredential');
}
