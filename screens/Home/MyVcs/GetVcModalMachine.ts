import {TextInput} from 'react-native';
import {
  assign,
  DoneInvokeEvent,
  ErrorPlatformEvent,
  EventFrom,
  sendParent,
  StateFrom,
} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {BackendResponseError, request} from '../../../shared/request';
import i18n from '../../../i18n';
import {AddVcModalMachine} from './AddVcModalMachine';
import {GET_INDIVIDUAL_ID, IndividualId} from '../../../shared/constants';
import {API_URLS} from '../../../shared/api';

const model = createModel(
  {
    idInputRef: null as TextInput,
    id: '',
    idError: '',
    otp: '',
    otpError: '',
    transactionId: '',
    iconColor: false,
    child: null,
    phoneNumber: '' as string,
    email: '' as string,
  },
  {
    events: {
      INPUT_ID: (id: string) => ({id}),
      INPUT_OTP: (otp: string) => ({otp}),
      VALIDATE_INPUT: () => ({}),
      RESEND_OTP: () => ({}),
      ACTIVATE_ICON_COLOR: () => ({}),
      DEACTIVATE_ICON_COLOR: () => ({}),
      READY: (idInputRef: TextInput) => ({idInputRef}),
      DISMISS: () => ({}),
      GOT_ID: (id: string) => ({id}),
    },
  },
);

export const GetVcModalEvents = model.events;

export const GetVcModalMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEEIQGoGMCyB7CAhgDYB0BmmYADgC4CWAdlAJITMNUCuNJATmAwhhejKAGIASgFFkAEQCaiUFVyw69XAyUgAHogC0ARgAsATgDMJAEynjhgBzmArE-v2AbDYA0IAJ4GrAHZ3EkCnKxMrc0NDc1NA+ycAXySfVAwcfGIyCmp6JlZ2Lh4AM1xMTjUmMR1YGgIaMDISxt4ACkMABk6ASjF0rDxCUnJKWlFCjm4SMoqqqG0VNQ0tJF0DWM6QwOjXQydjYyDbH38EIycQ+M6PI6t7TsNTdxS0tEGskdzxgrYpnjoECIYDEzAAcgAFACqABUAPrMWSLVTqOiabR6c6GdxOQIkRydcJRQnudweU6IezGEjGezxKxRQJPTamV4gAaZYY5Mb5Fh-YokQHAsToZAAGURyBhUgRkNhyOWaNWoExRisLmsuPMgSCgUC8XM9gpCCCThI5huNkNpme2qc5jZHKG2VGeQm-OmQpBAGUpGKpABheGIuEw+QQqQK1Hotaq-b2QwkTqmVzBTqBQnmdXGoyGKyheI6xnmYzmMmGR3vTku768yYCxgAN2IgNBcuDSLWS2jyvWWM6ZdCA6c6eMYQtuJz8WshuxHhcVkzDtS7Krzq+PPdRU9DGbRFboolsilMvB0JhUZWGIMpcs+1METHycSnWMxsfSdcZfM2pLFsNlYZOu3Jur824AruLYQGIvr+kGCKyKG4aRl2KJXrGGyEp0JCmPeOKJP+ZbGu4pg4XSOp0q+jgJKyK5Op8IE-Hy4F8GAACOnBwLyADyNBUGIECaE0Ta4AA1k09Fcq6TH1tM-AcVxoi8VQCAiZgDRKgA2p0AC6l5Kte-ZuNYpJ6par6XIExr2DYNI2bigRmDqJKAR8Um1lu-ysQpdRKXxYjCLwuC8CQVBEA0ZS8AAtiQkk1puYFefJnG+Uwymqbu5QaZo2l6ahioxiqBjxPYJAxFseZpnY0TGmYIROA43QPAOpkvHRa4MdJdYejQYiyMw3rYAN3r6YVfb6MY7jUtiWYllY7jYpE7jWWEZVPPcTILQ1FbtUBnUeWlfHgW255wtxMIQqNvZxnE1Iph4i4Wo8LXGqYhJJs1RwPj+32udWG6gVAynHf1g3DVdhkXDsSYJJ0VhmAyDi0rVGopqYVLww8jkmMubx7VyyWKUwAb8EIDD0MQAlCYKmXibFHUE+xKW8iTkACBTRAZY2WUrLlEMYVi2LYfc+xmDaJhklYxpdBaoSixE7gDjcxjJLtbnZITqVQKzZMcwFvBBSFYURcFMVxaQmss6T7N0MQXM81pun80VWKHImMS0sccPuHqUt+IgMTBGVDKLvquLUcYKQrgw+BwNo5uMd1LH8IIwiiM743YvqJBTQ+GZPDstJvv75zzZYYQKz9pYPG1ePqwDMk9TM5SVOn+U9pDsR5kOA4pjirjzU4OZl6E4QzbdhpbH9wFdZ5DZAmAGdxqW1JRM4Nrat0JimMaTJkfSwTGDcWY7XX-2J3PO57oCJBgFFtBnMoaEGQL+g7Hi9g6p49oq735jSzZT8jgEw+1worSOatz6z0Sg2SC+4IDN2ig0JeBhgj5hcIaT++wnhUiNCXEseILQ2TcGEDMP5T6rnxvFQGskILXwQQAI3IOJQQKDzgkUTJmDwOJFY4gsMaEcpEGoPBMGObU7hojT32glZiXkmxQTYW-DwJAMEkOwejZGJdJpAO1HSQ4U1QFSPcjI2h3lmZ+SoIo8qH9nC0gahYBIpJiLahwg+H25FXxxFrpQ+uF8YHcCsWQnOCN84GiLjmUs2wx5mGEdjIx1CmLA3+FYzwpEggPEmgaMueCzj6jxJ7A4r4VbagfPEi2TMiba2tuTW2RArGTXzA4cWJIdieGlo8UqEQDgYPTAQspJBBIMEXu3dCLt9B0ksIrRwtgDi4RtO00scsDiHATCWDJZTAlBGCXnR4YSqQ5kEaPLphgdjpntFSKOSQgA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./GetVcModalMachine.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      id: 'GetVcModal',
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
              invoke: {
                id: 'AddVcModal',
                src: AddVcModalMachine,
              },
              on: {
                INPUT_ID: {
                  actions: 'setId',
                },
                VALIDATE_INPUT: [
                  {
                    cond: 'isEmptyId',
                    target: '#GetVcModal.acceptingIdInput.invalid.empty',
                  },
                  {
                    cond: 'isWrongIdFormat',
                    target: '#GetVcModal.acceptingIdInput.invalid.format',
                  },
                  {
                    target: 'requestingOtp',
                  },
                ],
                ACTIVATE_ICON_COLOR: {
                  actions: 'setIconColorActivate',
                },
                DEACTIVATE_ICON_COLOR: {
                  actions: 'setIconColorDeactivate',
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
                ACTIVATE_ICON_COLOR: {
                  actions: 'setIconColorActivate',
                },
                DEACTIVATE_ICON_COLOR: {
                  actions: 'setIconColorDeactivate',
                },
              },
            },
            requestingOtp: {
              invoke: {
                src: 'requestOtp',
                onDone: [
                  {
                    target: '#GetVcModal.acceptingOtpInput',
                    actions: ['setPhoneNumber', 'setEmail'],
                  },
                ],
                onError: [
                  {
                    actions: 'setIdBackendError',
                    target: '#GetVcModal.acceptingIdInput.invalid.backend',
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
              target: 'requestingUinVid',
            },
            DISMISS: {
              actions: ['resetIdInputRef'],
              target: '#GetVcModal.acceptingIdInput',
            },
            RESEND_OTP: {
              target: '.resendOTP',
            },
          },
          initial: 'idle',
          states: {
            idle: {},
            resendOTP: {
              invoke: {
                src: 'requestOtp',
                onDone: [
                  {
                    target: 'idle',
                    actions: ['setPhoneNumber', 'setEmail'],
                  },
                ],
                onError: [
                  {
                    actions: 'setIdBackendError',
                    target: '#GetVcModal.acceptingIdInput.invalid.backend',
                  },
                ],
              },
            },
          },
        },
        requestingUinVid: {
          invoke: {
            src: 'requestingUinVid',
            onDone: [
              {
                actions: ['setIndividualId'],
                target: 'done',
              },
            ],
            onError: [
              {
                actions: 'setIdBackendError',
                cond: 'isIdInvalid',
                target: '#GetVcModal.acceptingIdInput.invalid.backend',
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
        },
      },
    },
    {
      actions: {
        forwardToParent: sendParent('DISMISS'),

        setId: model.assign({
          id: (_context, event) => event.id,
        }),

        setOtp: model.assign({
          otp: (_context, event) => event.otp,
        }),

        setPhoneNumber: model.assign({
          phoneNumber: (_context, event) => event.data.response.maskedMobile,
        }),

        setEmail: model.assign({
          email: (_context, event) => event.data.response.maskedEmail,
        }),

        setTransactionId: assign({
          transactionId: () => String(new Date().valueOf()).substring(3, 13),
        }),

        setIndividualId: (_context, event) => {
          GET_INDIVIDUAL_ID((event as DoneInvokeEvent<IndividualId>).data);
        },

        setIdBackendError: assign({
          idError: (context, event) => {
            if ((event as ErrorPlatformEvent).data == 'IDA-MLC-001') {
              return i18n.t('errors.backend.timeOut', {ns: 'GetVcModal'});
            }

            const message = (event as ErrorPlatformEvent).data.message;
            const ID_ERRORS_MAP = {
              'AID is not ready': 'applicationProcessing',
              'No message available': 'noMessageAvailable',
              'Network request failed': 'networkRequestFailed',
              'Invalid Input Parameter- individualId': 'invalidAid',
            };
            return ID_ERRORS_MAP[message]
              ? i18n.t(`errors.backend.${ID_ERRORS_MAP[message]}`, {
                  ns: 'GetVcModal',
                })
              : message;
          },
        }),

        clearIdError: model.assign({idError: ''}),

        setIdErrorEmpty: model.assign({
          idError: () => i18n.t('errors.input.empty', {ns: 'GetVcModal'}),
        }),

        setIdErrorWrongFormat: model.assign({
          idError: () =>
            i18n.t('errors.input.invalidFormat', {ns: 'GetVcModal'}),
        }),

        setOtpError: assign({
          otpError: (_context, event) => {
            const message = (event as ErrorPlatformEvent).data.message;
            const OTP_ERRORS_MAP = {
              'OTP is invalid': 'invalidOtp',
              'OTP has expired': 'expiredOtp',
            };
            return OTP_ERRORS_MAP[message]
              ? i18n.t(`errors.backend.${OTP_ERRORS_MAP[message]}`, {
                  ns: 'GetVcModal',
                })
              : message;
          },
        }),

        setIdInputRef: model.assign({
          idInputRef: (_context, event) => event.idInputRef,
        }),

        resetIdInputRef: model.assign({
          idInputRef: () => {
            return null;
          },
        }),

        clearOtp: assign({otp: ''}),

        setIconColorActivate: assign({iconColor: true}),

        setIconColorDeactivate: assign({iconColor: false}),

        focusInput: context => context.idInputRef.focus(),
      },

      services: {
        requestOtp: async context => {
          return await request(
            API_URLS.reqIndividualOTP.method,
            API_URLS.reqIndividualOTP.buildURL(),
            {
              id: 'mosip.identity.otp.internal',
              aid: context.id,
              metadata: {},
              otpChannel: ['EMAIL', 'PHONE'],
              requestTime: String(new Date().toISOString()),
              transactionID: context.transactionId,
              version: '1.0',
            },
          );
        },

        requestingUinVid: async context => {
          const response = await request(
            API_URLS.getIndividualId.method,
            API_URLS.getIndividualId.buildURL(),
            {
              aid: context.id,
              otp: context.otp,
              transactionID: context.transactionId,
            },
          );
          return {
            id: response.response.individualId,
            idType: response.response.individualIdType || 'UIN',
          };
        },
      },

      guards: {
        isEmptyId: ({id}) => id?.trim() === '',

        isWrongIdFormat: ({id}) => !/^\d{14,29}$/.test(id),

        isIdInvalid: (_context, event: unknown) =>
          ['RES-SER-449', 'IDA-MLC-001'].includes(
            (event as BackendResponseError).name,
          ),
      },
    },
  );

type State = StateFrom<typeof GetVcModalMachine>;

export function selectId(state: State) {
  return state.context.id;
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

export function selectIconColor(state: State) {
  return state.context.iconColor;
}

export function selectIsPhoneNumber(state: State) {
  return state.context.phoneNumber;
}

export function selectIsEmail(state: State) {
  return state.context.email;
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
  return state.matches('requestingUinVid');
}
