import {
  ActorRefFrom,
  assign,
  EventFrom,
  send,
  spawn,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { vcItemMachine } from '../../machines/vcItem';
import { AppServices } from '../../shared/GlobalContext';
import { createMyVcsTabMachine, MyVcsTabMachine } from './MyVcsTabMachine';
import {
  createReceivedVcsTabMachine,
  ReceivedVcsTabMachine,
} from './ReceivedVcsTabMachine';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    tabRefs: {
      myVcs: {} as ActorRefFrom<typeof MyVcsTabMachine>,
      receivedVcs: {} as ActorRefFrom<typeof ReceivedVcsTabMachine>,
    },
    selectedVc: null as ActorRefFrom<typeof vcItemMachine>,
    activeTab: 0,
  },
  {
    events: {
      SELECT_MY_VCS: () => ({}),
      SELECT_RECEIVED_VCS: () => ({}),
      SELECT_HISTORY: () => ({}),
      VIEW_VC: (vcItemActor: ActorRefFrom<typeof vcItemMachine>) => ({
        vcItemActor,
      }),
      DISMISS_MODAL: () => ({}),
    },
  }
);

const MY_VCS_TAB_REF_ID = 'myVcsTab';
const RECEIVED_VCS_TAB_REF_ID = 'receivedVcsTab';
const HISTORY_TAB_REF_ID = 'historyTab';

export const HomeScreenEvents = model.events;

export type TabRef =
  | ActorRefFrom<typeof MyVcsTabMachine>
  | ActorRefFrom<typeof ReceivedVcsTabMachine>;

export const HomeScreenMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./HomeScreenMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'HomeScreen',
    type: 'parallel',
    states: {
      tabs: {
        id: 'tabs',
        initial: 'init',
        on: {
          SELECT_MY_VCS: '.myVcs',
          SELECT_RECEIVED_VCS: '.receivedVcs',
          SELECT_HISTORY: '.history',
        },
        states: {
          init: {
            entry: ['spawnTabActors'],
            after: {
              100: 'myVcs',
            },
          },
          myVcs: {
            entry: [setActiveTab(0)],
            on: {
              DISMISS_MODAL: {
                actions: [
                  send('DISMISS', {
                    to: (context) => context.tabRefs.myVcs,
                  }),
                ],
              },
            },
          },
          receivedVcs: {
            entry: [setActiveTab(1)],
            on: {
              DISMISS_MODAL: {
                actions: [
                  send('DISMISS', {
                    to: (context) => context.tabRefs.receivedVcs,
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
            entry: ['resetSelectedVc'],
            on: {
              VIEW_VC: {
                target: 'viewingVc',
                actions: ['setSelectedVc'],
              },
            },
          },
          viewingVc: {
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
      spawnTabActors: assign({
        tabRefs: (context) => ({
          myVcs: spawn(
            createMyVcsTabMachine(context.serviceRefs),
            MY_VCS_TAB_REF_ID
          ),
          receivedVcs: spawn(
            createReceivedVcsTabMachine(context.serviceRefs),
            RECEIVED_VCS_TAB_REF_ID
          ),
        }),
      }),

      setSelectedVc: model.assign({
        selectedVc: (_, event) => event.vcItemActor,
      }),

      resetSelectedVc: model.assign({
        selectedVc: null,
      }),
    },
  }
);

function setActiveTab(activeTab: number) {
  return model.assign({ activeTab });
}

type State = StateFrom<typeof HomeScreenMachine>;

export function selectTabRefs(state: State) {
  return state.context.tabRefs;
}

export function selectActiveTab(state: State) {
  return state.context.activeTab;
}

export function selectSelectedVc(state: State) {
  return state.context.selectedVc;
}

export function selectViewingVc(state: State) {
  return state.matches('modals.viewingVc');
}

export function selectTabsLoaded(state: State) {
  return !state.matches('tabs.init');
}
