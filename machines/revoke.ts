import {TextInput} from 'react-native';
import {assign, ErrorPlatformEvent, EventFrom, send, StateFrom} from 'xstate';
import {log} from 'xstate/lib/actions';

import i18n from '../i18n';
import {AppServices} from '../shared/GlobalContext';
import {ActivityLogEvents} from './activityLog';
import {StoreEvents} from './store';
import {createModel} from 'xstate/lib/model';
import {request} from '../shared/request';
import {VcIdType} from '../types/VC/ExistingMosipVC/vc';
import {MY_VCS_STORE_KEY} from '../shared/constants';
import {VCMetadata} from '../shared/VCMetadata';
import {API_URLS} from '../shared/api';
import {getIdType} from '../shared/openId4VCI/Utils';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    idType: 'VID' as VcIdType,
    idError: '',
    otp: '',
    otpError: '',
    transactionId: '',
    requestId: '',
    VIDsMetadata: [] as VCMetadata[],
  },
  {
    events: {
      INPUT_OTP: (otp: string) => ({otp}),
      VALIDATE_INPUT: () => ({}),
      READY: (idInputRef: TextInput) => ({idInputRef}),
      DISMISS: () => ({}),
      SELECT_ID_TYPE: (idType: VcIdType) => ({idType}),
      REVOKE_VCS: (vcMetadatas: VCMetadata[]) => ({vcMetadatas}),
      STORE_RESPONSE: (response: string[]) => ({response}),
      ERROR: (data: Error) => ({data}),
      SUCCESS: () => ({}),
    },
  },
);

export const revokeVidsMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QCUwDcD2BrMA1AlhLAHSEA2YAxMgKK4DyA0jQPq4DCAyoqAA4ax8AF3wYAdjxAAPRACYAHAFZiARhUB2WQDZFABgCcO-boDMWgDQgAnohWyALLOK6X9k-J3zZirfYC+fpaomDgERKRiaACGZISUAJIAcgAKAKoAKiz06cmS-IIi4pIyCOq6TuomjvYqWlpe3iaWNgiKik4u5fK69vr2uipmAUHo2HiEJPiRMXEAIvGcALIL3Egg+cKiEmslZRVVDrX1so3Nclr6zi61pvLyKoY9wyDBY2EkUQDGn2C8ImJQXDxWaTCAUah0JisDirPgCTZFHaIEyydTEe6yEyaQzqXrtM4IeQmXRXcrqDz9dQPEzPV6hCbEL4-P5TQHAkgAJzAAEcAK5wf5QehCXiUCDiMAREKSunjcJM36CoEg4hcvkC1nC3gIKaYT5RQpiADaugAunl4Ybioh8dZbHtiHoevpFESlIp9DTAi9RvT5d9FazlZyefzYIKtZQwByORgOcReGQDQAzOMAW2IsvejIDLIBwdVoY1AK1OsiGH1hpN5rWGytSIQJix6LsWNkOLxsgJKLRnVMlXJdxq-m9WYZCrzbJBlHmSxWFoKW2tjdRLcx2K0uJdXbtCGMpN03Qe-X03VktN9co+uYjIviYl4vKECRSGSyOQXCO2oBKKkPaNdRQqXsRRBi0EwXQJep5EdFxURdTczB0C9pWzCdb14e9H2fWdlk4WF1ktJcGwUZQ1E0HQDCMUwLF3NQ+lJVFN3kXFvBQt4GTVMNBVlMUJSlMZM0vbMuOLKBZTLPUDS2atP3rH9bH-R0lGA0CzAgxQCRqS4nQ0F0-10SoRxGVDOKLcNWV46NY3jRMU3TITTPCUSLIBCTdQraTxFk2siMRBTSh3FpBhdWCeiAqkiSA4yfSckMQiDT4ZwWPCCLrYiAq8AlBgeYg6jKLF1DaB5ygCb0xAwCA4EkMdwnIMA5Iy6RbEMPKNGJSo2nuD17Gyh5lDqC59HUTwVBqL0TI4urpliCBiAwEVGv85rWipZx5GGxRiV8GjNN3BQALg8bMS0citHYv1JhmwhiAAIy+HAxAgJbvxWto0T6doTlkFwtBOFRuzaMK1G6TdqWGi6rylGZnt8xdlpKLaTGIT7vp+3Q-tkAH9pUZRdNOux9KxGLauvZklXZUgwQauGv2XH7LhMOwai+zcfvkXrd3sHQwsPal7C8WpFEhtCbyDSmXIwl7l00btud5twLj-Op5BF8cxfzdlpYbAXspYhW9iG3w1f9cnNTvB8n21gKBbROpHEAhn20UTngp+lRiCx7nN1uAxMRNkN1Vc8TL2tlaiTRQZtBMCKBe+gkXZJJ1tB6ECBf0FQA8LBL80+MPf3bGC7lRDHT1TptuzuMLDhRMwzoD-O5Fd2wYOuVF-raXx7HUMq-CAA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./revoke.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      id: 'RevokeVids',
      initial: 'acceptingVIDs',
      states: {
        idle: {
          on: {
            REVOKE_VCS: {
              actions: ['setTransactionId', 'clearOtp'],
              target: 'acceptingOtpInput',
            },
          },
        },
        invalid: {
          states: {
            otp: {},
            backend: {},
          },
          on: {
            INPUT_OTP: {
              actions: 'setOtp',
              target: 'requestingRevoke',
            },
            DISMISS: {
              target: 'idle',
            },
          },
        },
        acceptingVIDs: {
          entry: ['setTransactionId', 'clearOtp'],
          initial: 'idle',
          states: {
            idle: {
              on: {
                REVOKE_VCS: {
                  actions: 'setVIDs',
                  target: '#RevokeVids.acceptingOtpInput',
                },
              },
            },
            requestingOtp: {
              invoke: {
                src: 'requestOtp',
                onDone: [
                  {
                    actions: log('accepting OTP'),
                    target: '#RevokeVids.acceptingOtpInput',
                  },
                ],
                onError: [
                  {
                    actions: [log('error OTP'), 'setIdBackendError'],
                    target: '#RevokeVids.invalid.backend',
                  },
                ],
              },
            },
          },
          on: {
            DISMISS: {
              target: 'idle',
            },
          },
        },
        acceptingOtpInput: {
          entry: 'clearOtp',
          on: {
            INPUT_OTP: {
              actions: 'setOtp',
              target: 'requestingRevoke',
            },
            DISMISS: {
              target: 'idle',
            },
          },
        },
        requestingRevoke: {
          invoke: {
            src: 'requestRevoke',
          },
          on: {
            ERROR: {
              actions: [log('error on Revoking'), 'setOtpError'],
              target: 'acceptingOtpInput',
            },
            SUCCESS: {
              target: 'revokingVc',
            },
          },
        },
        revokingVc: {
          entry: ['revokeVID'],
          on: {
            STORE_RESPONSE: {
              target: 'loggingRevoke',
            },
          },
        },
        loggingRevoke: {
          entry: [log('loggingRevoke'), 'logRevoked'],
          on: {
            DISMISS: {
              target: 'acceptingVIDs',
            },
          },
        },
      },
    },
    {
      actions: {
        setOtp: model.assign({
          otp: (_context, event) => event.otp,
        }),

        setTransactionId: assign({
          transactionId: () => String(new Date().valueOf()).substring(3, 13),
        }),

        setVIDs: model.assign({
          VIDsMetadata: (_context, event) => event.vcMetadatas,
        }),

        setIdBackendError: assign({
          idError: (context, event) => {
            const message = (event as ErrorPlatformEvent).data.message;
            const ID_ERRORS_MAP = {
              'UIN invalid': 'invalidUin',
              'VID invalid': 'invalidVid',
              'UIN not available in database': 'missingUin',
              'VID not available in database': 'missingVid',
              'Invalid Input Parameter - individualId':
                context.idType === 'UIN' ? 'invalidUin' : 'invalidVid',
            };
            return ID_ERRORS_MAP[message]
              ? i18n.t(`errors.backend.${ID_ERRORS_MAP[message]}`, {
                  ns: 'RevokeVids',
                })
              : message;
          },
        }),

        setOtpError: assign({
          otpError: (_context, event) => {
            const message = (event as ErrorPlatformEvent).data.message;
            const OTP_ERRORS_MAP = {
              'OTP is invalid': 'invalidOtp',
            };
            return OTP_ERRORS_MAP[message]
              ? i18n.t(`errors.backend.${OTP_ERRORS_MAP[message]}`, {
                  ns: 'RevokeVids',
                })
              : message;
          },
        }),

        clearOtp: assign({otp: ''}),

        logRevoked: send(
          context =>
            ActivityLogEvents.LOG_ACTIVITY(
              context.VIDsMetadata.map(metadata => ({
                _vcKey: metadata.getVcKey(),
                id: metadata.id,
                idType: getIdType(metadata.issuer),
                type: 'VC_REVOKED',
                timestamp: Date.now(),
                deviceName: '',
                vcLabel: metadata.id,
              })),
            ),
          {
            to: context => context.serviceRefs.activityLog,
          },
        ),

        revokeVID: send(
          context => {
            return StoreEvents.REMOVE_ITEMS(
              MY_VCS_STORE_KEY,
              context.VIDsMetadata.map(m => m.getVcKey()),
            );
          },
          {
            to: context => context.serviceRefs.store,
          },
        ),
      },

      services: {
        requestOtp: async context => {
          const transactionId = String(new Date().valueOf()).substring(3, 13);
          return request(
            API_URLS.requestOtp.method,
            API_URLS.requestOtp.buildURL(),
            {
              individualId: context.VIDsMetadata[0].id,
              individualIdType: 'VID',
              otpChannel: ['EMAIL', 'PHONE'],
              transactionID: transactionId,
            },
          );
        },

        requestRevoke: context => async callback => {
          await Promise.all(
            context.VIDsMetadata.map((metadata: VCMetadata) => {
              try {
                const transactionId = String(new Date().valueOf()).substring(
                  3,
                  13,
                );
                return request(
                  API_URLS.requestRevoke.method,
                  API_URLS.requestRevoke.buildURL(metadata.id),
                  {
                    transactionID: transactionId,
                    vidStatus: 'REVOKED',
                    individualId: metadata.id,
                    individualIdType: 'VID',
                    otp: context.otp,
                  },
                );
              } catch (error) {
                console.log('error.message', error.message);
                return error;
              }
            }),
          )
            .then(() => {
              callback('SUCCESS');
            })
            .catch(error => {
              callback({type: 'ERROR', data: error});
            });
        },
      },

      guards: {},
    },
  );

export function createRevokeMachine(serviceRefs: AppServices) {
  return revokeVidsMachine.withContext({
    ...revokeVidsMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof revokeVidsMachine>;

export const RevokeVidsEvents = model.events;

export function selectIdType(state: State) {
  return state.context.idType;
}

export function selectIdError(state: State) {
  return state.context.idError;
}

export function selectOtpError(state: State) {
  return state.context.otpError;
}

export function selectIsRevokingVc(state: State) {
  return state.matches('revokingVc');
}

export function selectIsLoggingRevoke(state: State) {
  return state.matches('loggingRevoke');
}

export function selectIsAcceptingOtpInput(state: State) {
  return state.matches('acceptingOtpInput');
}
