import { EventFrom, send, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { VC_ITEM_STORE_KEY } from '../shared/constants';
import { AppServices } from '../shared/GlobalContext';
import { CredentialDownloadResponse, request } from '../shared/request';
import {
  VC,
  VerifiableCredential,
  VcIdType,
  DecodedCredential,
} from '../types/vc';
import { StoreEvents } from './store';
import { ActivityLogEvents } from './activityLog';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    id: '',
    idType: '' as VcIdType,
    tag: '',
    generatedOn: null as Date,
    credential: null as DecodedCredential,
    verifiableCredential: null as VerifiableCredential,
    requestId: '',
  },
  {
    events: {
      EDIT_TAG: () => ({}),
      SAVE_TAG: (tag: string) => ({ tag }),
      STORE_READY: () => ({}),
      DISMISS: () => ({}),
      CREDENTIAL_DOWNLOADED: (vc: VC) => ({ vc }),
      STORE_RESPONSE: (response: VC) => ({ response }),
      POLL: () => ({}),
      DOWNLOAD_READY: () => ({}),
      GET_VC_RESPONSE: (vc: VC) => ({ vc }),
    },
  }
);

export const VcItemEvents = model.events;

type SaveTagEvent = EventFrom<typeof model, 'SAVE_TAG'>;
type GetVcResponseEvent = EventFrom<typeof model, 'GET_VC_RESPONSE'>;
type StoreResponseEvent = EventFrom<typeof model, 'STORE_RESPONSE'>;
type CredentialDownloadedEvent = EventFrom<
  typeof model,
  'CREDENTIAL_DOWNLOADED'
>;

type RequestVcDataEvent =
  | StoreResponseEvent
  | CredentialDownloadedEvent
  | GetVcResponseEvent;

export const vcItemMachine = model.createMachine(
  {
    id: 'vc-item',
    context: model.initialContext,
    initial: 'checkingVc',
    states: {
      checkingVc: {
        entry: ['requestVcContext'],
        on: {
          GET_VC_RESPONSE: [
            {
              cond: 'hasCredential',
              target: 'idle',
              actions: ['setCredential'],
            },
            {
              target: 'checkingStore',
            },
          ],
        },
      },
      checkingStore: {
        entry: ['requestStoredContext'],
        on: {
          STORE_RESPONSE: [
            {
              cond: 'hasCredential',
              target: 'idle',
              actions: ['setCredential', 'updateVc'],
            },
            {
              target: 'checkingServerData',
            },
          ],
        },
      },
      checkingServerData: {
        initial: 'checkingStatus',
        states: {
          checkingStatus: {
            invoke: {
              id: 'checkStatus',
              src: 'checkStatus',
            },
            on: {
              POLL: {
                actions: [send('POLL_STATUS', { to: 'checkStatus' })],
              },
              DOWNLOAD_READY: 'downloadingCredential',
            },
          },
          downloadingCredential: {
            invoke: {
              id: 'downloadCredential',
              src: 'downloadCredential',
            },
            on: {
              POLL: {
                actions: [send('POLL_DOWNLOAD', { to: 'downloadCredential' })],
              },
              CREDENTIAL_DOWNLOADED: {
                target: '#idle',
                actions: [
                  'setCredential',
                  'storeContext',
                  'updateVc',
                  'logDownloaded',
                ],
              },
            },
          },
        },
      },
      idle: {
        id: 'idle',
        on: {
          EDIT_TAG: 'editingTag',
        },
      },
      editingTag: {
        on: {
          DISMISS: 'idle',
          SAVE_TAG: {
            target: 'storingTag',
            actions: ['setTag'],
          },
        },
      },
      storingTag: {
        entry: ['storeTag'],
        on: {
          STORE_RESPONSE: 'idle',
        },
      },
    },
  },
  {
    actions: {
      updateVc: send(
        (context) => {
          const { serviceRefs, ...vc } = context;
          return { type: 'VC_DOWNLOADED', vc };
        },
        { to: (context) => context.serviceRefs.vc }
      ),

      requestVcContext: send(
        (context) => ({
          type: 'GET_VC_ITEM',
          vcKey: VC_ITEM_STORE_KEY(context),
        }),
        {
          to: (context) => context.serviceRefs.vc,
        }
      ),

      requestStoredContext: send(
        (context) => StoreEvents.GET(VC_ITEM_STORE_KEY(context)),
        {
          to: (context) => context.serviceRefs.store,
        }
      ),

      storeContext: send(
        (context) => {
          const { serviceRefs, ...data } = context;
          return StoreEvents.SET(VC_ITEM_STORE_KEY(context), data);
        },
        {
          to: (context) => context.serviceRefs.store,
        }
      ),

      setTag: model.assign({
        tag: (_, event: SaveTagEvent) => event.tag,
      }),

      storeTag: send(
        (context) => {
          const { serviceRefs, ...data } = context;
          return StoreEvents.SET(VC_ITEM_STORE_KEY(context), data);
        },
        { to: (context) => context.serviceRefs.store }
      ),

      setCredential: model.assign((_, event: RequestVcDataEvent) => {
        switch (event.type) {
          case 'STORE_RESPONSE':
            return event.response;
          case 'GET_VC_RESPONSE':
          case 'CREDENTIAL_DOWNLOADED':
            return event.vc;
        }
      }),

      logDownloaded: send(
        (_, event: CredentialDownloadedEvent) =>
          ActivityLogEvents.LOG_ACTIVITY({
            _vcKey: VC_ITEM_STORE_KEY(event.vc),
            action: 'downloaded',
            timestamp: Date.now(),
            deviceName: '',
            vcLabel: event.vc.tag || event.vc.id,
          }),
        { to: (context) => context.serviceRefs.activityLog }
      ),
    },

    services: {
      checkStatus: (context) => (callback, onReceive) => {
        const pollInterval = setInterval(
          () => callback(model.events.POLL()),
          5000
        );

        onReceive(async (event) => {
          if (event.type === 'POLL_STATUS') {
            const response = await request(
              'GET',
              `/credentialshare/request/status/${context.requestId}`
            );
            switch (response.response?.statusCode) {
              case 'NEW':
                break;
              case 'ISSUED':
              case 'printing':
                callback(model.events.DOWNLOAD_READY());
                break;
            }
          }
        });

        return () => clearInterval(pollInterval);
      },

      downloadCredential: (context) => (callback, onReceive) => {
        const pollInterval = setInterval(
          () => callback(model.events.POLL()),
          5000
        );

        onReceive(async (event) => {
          if (event.type === 'POLL_DOWNLOAD') {
            const response: CredentialDownloadResponse = await request(
              'POST',
              '/credentialshare/download',
              {
                individualId: context.id,
                requestId: context.requestId,
              }
            );

            callback(
              model.events.CREDENTIAL_DOWNLOADED({
                credential: response.credential,
                verifiableCredential: response.verifiableCredential,
                generatedOn: new Date(),
                id: context.id,
                idType: context.idType,
                tag: '',
                requestId: context.requestId,
              })
            );
          }
        });

        return () => clearInterval(pollInterval);
      },
    },

    guards: {
      hasCredential: (_, event: StoreResponseEvent) => {
        return (
          event.response?.credential != null &&
          event.response?.verifiableCredential != null
        );
      },
    },
  }
);

export const createVcItemMachine = (
  serviceRefs: AppServices,
  vcKey: string
) => {
  const [_, idType, id, requestId] = vcKey.split(':');
  return vcItemMachine.withContext({
    ...vcItemMachine.context,
    serviceRefs,
    id,
    idType: idType as VcIdType,
    requestId,
  });
};

type State = StateFrom<typeof vcItemMachine>;

export function selectVc(state: State) {
  const { serviceRefs, ...data } = state.context;
  return data;
}

export function selectGeneratedOn(state: State) {
  return new Date(state.context.generatedOn).toLocaleDateString();
}

export function selectId(state: State) {
  return state.context.id;
}

export function selectIdType(state: State) {
  return state.context.idType;
}

export function selectTag(state: State) {
  return state.context.tag;
}

export function selectCredential(state: State) {
  return state.context.credential;
}

export function selectVerifiableCredential(state: State) {
  return state.context.verifiableCredential;
}

export function selectIsEditingTag(state: State) {
  return state.matches('editingTag');
}
