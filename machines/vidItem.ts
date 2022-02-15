import { ActorRefFrom, ContextFrom, EventFrom, send, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { VID_ITEM_STORE_KEY } from '../shared/storeKeys';
import { AppServices } from '../shared/GlobalContext';
import { CredentialDownloadResponse, request } from '../shared/request';
import { VID, VIDCredential, VIDVerifiableCredential } from '../types/vid';
import { StoreEvents, storeMachine } from './store';
import { ActivityLogEvents } from './activityLog';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    uin: '',
    tag: '',
    generatedOn: null as Date,
    credential: null as VIDCredential,
    verifiableCredential: null as VIDVerifiableCredential,
    requestId: '',
  },
  {
    events: {
      EDIT_TAG: () => ({}),
      SAVE_TAG: (tag: string) => ({ tag }),
      STORE_READY: () => ({}),
      DISMISS: () => ({}),
      CREDENTIAL_DOWNLOADED: (vid: VID) => ({ vid }),
      STORE_RESPONSE: (response: VID) => ({ response }),
      POLL: () => ({}),
      DOWNLOAD_READY: () => ({}),
      GET_VID_RESPONSE: (vid: VID) => ({ vid }),
    },
  }
);

export const VidItemEvents = model.events;

type SaveTagEvent = EventFrom<typeof model, 'SAVE_TAG'>;
type GetVidResponseEvent = EventFrom<typeof model, 'GET_VID_RESPONSE'>;
type StoreResponseEvent = EventFrom<typeof model, 'STORE_RESPONSE'>;
type CredentialDownloadedEvent = EventFrom<
  typeof model,
  'CREDENTIAL_DOWNLOADED'
>;

type RequestVidDataEvent =
  | StoreResponseEvent
  | CredentialDownloadedEvent
  | GetVidResponseEvent;

export const vidItemMachine = model.createMachine(
  {
    id: 'vid-item',
    context: model.initialContext,
    initial: 'checkingVid',
    states: {
      checkingVid: {
        entry: ['requestVidContext'],
        on: {
          GET_VID_RESPONSE: [
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
              actions: ['setCredential'],
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
                actions: ['setCredential', 'storeContext', 'logDownloaded'],
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
      requestVidContext: send(
        (context) => ({
          type: 'GET_VID_ITEM',
          vidKey: VID_ITEM_STORE_KEY(context.uin, context.requestId),
        }),
        {
          to: (context) => context.serviceRefs.vid,
        }
      ),

      requestStoredContext: send(
        (context) =>
          StoreEvents.GET(VID_ITEM_STORE_KEY(context.uin, context.requestId)),
        {
          to: (context) => context.serviceRefs.store,
        }
      ),

      storeContext: send(
        (context) => {
          const { serviceRefs, ...data } = context;
          return StoreEvents.SET(
            VID_ITEM_STORE_KEY(context.uin, context.requestId),
            data
          );
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
          return StoreEvents.SET(
            VID_ITEM_STORE_KEY(context.uin, context.requestId),
            data
          );
        },
        { to: (context) => context.serviceRefs.store }
      ),

      setCredential: model.assign((_, event: RequestVidDataEvent) => {
        switch (event.type) {
          case 'STORE_RESPONSE':
            return event.response;
          case 'GET_VID_RESPONSE':
          case 'CREDENTIAL_DOWNLOADED':
            return event.vid;
        }
      }),

      logDownloaded: send(
        (_, event: CredentialDownloadedEvent) =>
          ActivityLogEvents.LOG_ACTIVITY({
            _vidKey: VID_ITEM_STORE_KEY(event.vid.uin, event.vid.requestId),
            action: 'downloaded',
            timestamp: Date.now(),
            deviceName: '',
            vidLabel: event.vid.tag || event.vid.uin,
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
              `/v1/resident/credentialshare/request/status/${context.requestId}`
            );
            switch (response.response?.statusCode) {
              case 'NEW':
                break;
              case 'ISSUED':
                // TODO: remove temporary fix to DataShare API issue blocking us from moving to printing status
                callback(model.events.DOWNLOAD_READY());
                break;
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
              '/v1/resident/credentialshare/download',
              {
                individualId: context.uin,
                requestId: context.requestId,
              }
            );

            callback(
              model.events.CREDENTIAL_DOWNLOADED({
                credential: response.credential,
                verifiableCredential: response.verifiableCredential,
                generatedOn: new Date(),
                uin: context.uin,
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

export const createVidItemMachine = (
  serviceRefs: AppServices,
  vidKey: string
) => {
  const [_, uin, requestId] = vidKey.split(':');
  return vidItemMachine.withContext({
    ...vidItemMachine.context,
    serviceRefs,
    uin,
    requestId,
  });
};

type State = StateFrom<typeof vidItemMachine>;

export function selectVid(state: State) {
  const { serviceRefs, ...data } = state.context;
  return data;
}

export function selectGeneratedOn(state: State) {
  return new Date(state.context.generatedOn).toLocaleDateString();
}

export function selectUin(state: State) {
  return state.context.uin;
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
