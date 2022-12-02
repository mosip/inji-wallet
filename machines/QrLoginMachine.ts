import { EventFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { AppServices } from '../shared/GlobalContext';
import { log } from 'xstate/lib/actions';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    linkingCode: '',
  },
  {
    events: {
      SHOW_QRCODE: () => ({}),
      SCANNING_DONE: (params: string) => ({ params }),
      DONE_WARNING: () => ({}),
      FACEAUTH_SUCCESS: () => ({}),
      DISMISS: () => ({}),
    },
  }
);

export const BindVcModalEvents = model.events;

export const qrLoginMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEUBOAZA9lAlgOwDpYALTAdzQGFMIwBiAZUoEEA5VgSVYHEB9AEQDyrAKIBtAAwBdRKAAOmWDgAuOTHlkgAHogCMATl0EJ+gMwB2cxIMAOAEwAWJ+YA0IAJ6IbpgnYCsEtYOAGwSDqY2EjYAvtFuaFi4hCTkAOoAhqh4+FB0QqK8qcwASpw8kjJIIApKquqaOgh+FgR+dlE2Nvp+DjbB+g5ungjevgFBoeGRMXEgCdj4BABm6QDGYMwArsrEdABizJQizACqACoAErwMJ5RHDAwVmjUqahpVjTbhvnb6dqHBGzmLrBPxDLw+fyBXQhMIRKKxWZ4GhwTTzJLPRSveofRAAWmC4IQeL8BH05PJFj8Nl0XzsunMfli8QwC2SpAoqGotExtTeDUQDjsRNGgUCpjC1PFpjszLmrKSRA5GSyOV52PeoEaEQcPz+tPMoXswVcHghxjFJj8A0BIRmLMSixW6y2O3VdU12kQ5jsdgIwShwN0Bj8lkGZpGPktVptX2Cpjl6MWEHUYHd-NxCF0EmCwQIph6dks-WDAXDw1FYolDilElMMsR0SAA */
  model.createMachine(
    {
      tsTypes: {} as import('./QrLoginMachine.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            SHOW_QRCODE: {
              target: 'scanQrCode',
              actions: [log('scanQrCode called............')],
            },
          },
        },
        scanQrCode: {
          on: {
            SCANNING_DONE: {
              target: 'showWarning',
            },
            DISMISS: {
              target: 'idle',
            },
          },
        },
        showWarning: {
          on: {
            DONE_WARNING: {
              target: 'faceAuth',
            },
            DISMISS: {
              target: 'idle',
            },
          },
        },
        faceAuth: {
          on: {
            FACEAUTH_SUCCESS: {
              target: 'done',
            },
          },
        },
        done: {
          type: 'final',
        },
      },
      id: 'QrLogin',
    },
    {
      actions: {
        // setLinkingCode: assign({
        //     linkingCode: (context, event) => event.linkingCode,
        // }),
      },
    }
  );

export function createQrLoginMachine(serviceRefs: AppServices) {
  return qrLoginMachine.withContext({
    ...qrLoginMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof qrLoginMachine>;

export const QrLoginEvents = model.events;

export function selectIsScanQrCode(state: State) {
  return state.matches('scanQrCode');
}

export function selectIsShowWarning(state: State) {
  return state.matches('showWarning');
}
