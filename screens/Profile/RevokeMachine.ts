import { TextInput } from 'react-native';
import {
  assign,
  ErrorPlatformEvent,
  StateFrom,
  send
} from 'xstate';
import { AppServices } from '../../shared/GlobalContext';
import { ActivityLogEvents } from '../../machines/activityLog';
import { createModel } from 'xstate/lib/model';
import { request } from '../../shared/request';
import { VC_ITEM_STORE_KEY } from '../../shared/constants';
import { VcIdType } from '../../types/vc';
import i18n from '../../i18n';

// ----- CREATE MODEL ---------------------------------------------------------
const model = createModel(
  {
    serviceRefs: {} as AppServices,
    idType: 'VID' as VcIdType,
    idError: '',
    otp: '',
    otpError: '',
    transactionId: '',
    requestId: '',
    VIDs: []
  },
  {
    events: {
      INPUT_OTP: (otp: string) => ({ otp }),
      VALIDATE_INPUT: () => ({}),
      READY: (idInputRef: TextInput) => ({ idInputRef }),
      DISMISS: () => ({}),
      SELECT_ID_TYPE: (idType: VcIdType) => ({ idType }),
      REVOKE_VCS: (vcKeys: string[]) => ({vcKeys})
    },
  }
);
// ----------------------------------------------------------------------------

// ----- CREATE MACHINE -------------------------------------------------------
export const revokeVidsMachine = model.createMachine(
  {
    id: 'RevokeVids',
    context: model.initialContext,
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
      acceptingVIDs: {
        entry: ['setTransactionId', 'clearOtp'],
        initial: 'idle',
        states: {
          idle: {
            on: {
              REVOKE_VCS: {
                actions: ['setVIDs'],
                target: 'requestingOtp',
              },
            },
          },
          requestingOtp: {
            invoke: {
              src: 'requestOtp',
              onDone: [
                {
                  target: '#RevokeVids.acceptingOtpInput',
                },
              ],
              onError: [
                {
                  actions: 'setIdBackendError',
                  target: '#RevokeVids.idle',
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
          onDone: [
            {
              target: 'revokingVc',
            },
          ],
          onError: [
            {
              actions: 'setOtpError',
              target: 'acceptingOtpInput',
            },
          ],
        },
      },
      revokingVc: {
        entry: ['logRevoked'],
        on: {
          DISMISS: {
            target: 'idle',
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
        VIDs: (_context, event) => event.vcKeys,
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

      clearOtp: assign({ otp: '' }),
      
      logRevoked: async(_context) => {
        _context.VIDs.forEach((vc) => {
          send(
            (_context) =>
              ActivityLogEvents.LOG_ACTIVITY({
                _vcKey: VC_ITEM_STORE_KEY(vc),
                action: 'revoked',
                timestamp: Date.now(),
                deviceName: '',
                vcLabel: vc.split(":")[2],
              }),
            {
              to: (context) => context.serviceRefs.activityLog,
            }
          )
          return 
        })
      }
    },

    services: {
      requestOtp: async (context) => {
        const transactionId = String(new Date().valueOf()).substring(3, 13);
        return request('POST', '/req/otp', {
          individualId: context.VIDs[0].split(":")[2],
          individualIdType: "VID",
          otpChannel: ['EMAIL', 'PHONE'],
          transactionID: transactionId,
        });
      },

      requestRevoke: async (context) => {
        try {
          return await Promise.all(
            context.VIDs.map((vid: string) => {
              const vidID = vid.split(":")[2];
              const transactionId = String(new Date().valueOf()).substring(3, 13);
              return request('PATCH', `/vid/${vidID}`, {
                transactionID: transactionId,
                vidStatus: 'REVOKED',
                individualId: vidID,
                individualIdType: 'VID',
                otp: context.otp,
              });
            }),
          );
        } catch (error) {
          console.error(error);
        }
      },
    },

    guards: { },
  }
);

// ----------------------------------------------------------------------------

// ----- TYPES ----------------------------------------------------------------
type State = StateFrom<typeof revokeVidsMachine>;

// ----- OTHER EXPORTS --------------------------------------------------------
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