import { ActorRefFrom, EventFrom, send, spawn, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { vidItemMachine } from '../../machines/vidItem';
import { AppServices } from '../../shared/GlobalContext';
import {
  createHistoryTabMachine,
  HistoryTabMachine,
} from './HistoryTabMachine';
import { createMyVidsTabMachine, MyVidsTabMachine } from './MyVidsTabMachine';
import {
  createReceivedVidsTabMachine,
  ReceivedVidsTabMachine,
} from './ReceivedVidsTabMachine';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    tabRefs: {
      myVids: {} as ActorRefFrom<typeof MyVidsTabMachine>,
      receivedVids: {} as ActorRefFrom<typeof ReceivedVidsTabMachine>,
      history: {} as ActorRefFrom<typeof HistoryTabMachine>,
    },
    selectedVid: null as ActorRefFrom<typeof vidItemMachine>,
    activeTab: 0,
  },
  {
    events: {
      SELECT_MY_VIDS: () => ({}),
      SELECT_RECEIVED_VIDS: () => ({}),
      SELECT_HISTORY: () => ({}),
      VIEW_VID: (vidItemActor: ActorRefFrom<typeof vidItemMachine>) => ({
        vidItemActor,
      }),
      DISMISS_MODAL: () => ({}),
    },
  }
);

export const HomeScreenEvents = model.events;

type ViewVidEvent = EventFrom<typeof model, 'VIEW_VID'>;

export const HomeScreenMachine = model.createMachine(
  {
    id: 'HomeScreen',
    context: model.initialContext,
    type: 'parallel',
    states: {
      tabs: {
        id: 'tabs',
        initial: 'init',
        on: {
          SELECT_MY_VIDS: '.myVids',
          SELECT_RECEIVED_VIDS: '.receivedVids',
          SELECT_HISTORY: '.history',
        },
        states: {
          init: {
            entry: ['spawnTabActors'],
            after: {
              100: 'myVids',
            },
          },
          myVids: {
            entry: [setActiveTab(0)],
            on: {
              DISMISS_MODAL: {
                actions: [
                  send('DISMISS', {
                    to: (context) => context.tabRefs.myVids,
                  }),
                ],
              },
            },
          },
          receivedVids: {
            entry: [setActiveTab(1)],
            on: {
              DISMISS_MODAL: {
                actions: [
                  send('DISMISS', {
                    to: (context) => context.tabRefs.receivedVids,
                  }),
                ],
              },
            },
          },
          history: {
            entry: [setActiveTab(2)],
          },
        },
      },
      modals: {
        initial: 'none',
        states: {
          none: {
            entry: ['resetSelectedVid'],
            on: {
              VIEW_VID: {
                target: 'viewingVid',
                actions: ['setSelectedVid'],
              },
            },
          },
          viewingVid: {
            on: {
              DISMISS_MODAL: 'none',
            },
          },
        },
      },
    },
  },
  {
    actions: {
      spawnTabActors: model.assign({
        tabRefs: (context) => ({
          myVids: spawn(
            createMyVidsTabMachine(context.serviceRefs),
            'myVidsTab'
          ),
          receivedVids: spawn(
            createReceivedVidsTabMachine(context.serviceRefs),
            'receivedVidsTab'
          ),
          history: spawn(
            createHistoryTabMachine(context.serviceRefs),
            'historyTab'
          ),
        }),
      }),

      setSelectedVid: model.assign({
        selectedVid: (_, event: ViewVidEvent) => event.vidItemActor,
      }),

      resetSelectedVid: model.assign({
        selectedVid: null,
      }),
    },
  }
);

function setActiveTab(activeTab: number) {
  return model.assign({ activeTab });
}

type State = StateFrom<typeof HomeScreenMachine>;

export function selectActiveTab(state: State) {
  return state.context.activeTab;
}

export function selectSelectedVid(state: State) {
  return state.context.selectedVid;
}

export function selectViewingVid(state: State) {
  return state.matches('modals.viewingVid');
}

export function selectTabsLoaded(state: State) {
  return !state.matches('tabs.init');
}
