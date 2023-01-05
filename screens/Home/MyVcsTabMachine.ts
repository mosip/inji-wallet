import {
  ActorRefFrom,
  DoneInvokeEvent,
  EventFrom,
  send,
  sendParent,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { StoreEvents, StoreResponseEvent } from '../../machines/store';
import { VcEvents } from '../../machines/vc';
import { vcItemMachine } from '../../machines/vcItem';
import { AppServices } from '../../shared/GlobalContext';
import {
  MY_VCS_STORE_KEY,
  ONBOARDING_STATUS_STORE_KEY,
} from '../../shared/constants';
import { AddVcModalMachine } from './MyVcs/AddVcModalMachine';
import { GetVcModalMachine } from './MyVcs/GetVcModalMachine';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
  },
  {
    events: {
      REFRESH: () => ({}),
      VIEW_VC: (vcItemActor: ActorRefFrom<typeof vcItemMachine>) => ({
        vcItemActor,
      }),
      DISMISS: () => ({}),
      STORE_RESPONSE: (response?: unknown) => ({ response }),
      ADD_VC: () => ({}),
      GET_VC: () => ({}),
      ONBOARDING_DONE: () => ({}),
    },
  }
);

export const MyVcsTabEvents = model.events;

type ViewVcEvent = EventFrom<typeof model, 'VIEW_VC'>;

export const MyVcsTabMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./MyVcsTabMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'MyVcsTab',
    initial: 'checkingOnboardingStatus',
    states: {
      checkingOnboardingStatus: {
        entry: ['getOnboardingStatus'],
        on: {
          STORE_RESPONSE: [
            { cond: 'isOnboardingDone', target: 'idle' },
            { target: 'onboarding' },
          ],
        },
      },
      onboarding: {
        on: {
          ADD_VC: {
            target: 'addingVc',
            actions: ['completeOnboarding'],
          },
          ONBOARDING_DONE: {
            target: 'idle',
            actions: ['completeOnboarding'],
          },
        },
      },
      idle: {
        id: 'idle',
        on: {
          ADD_VC: 'addingVc',
          VIEW_VC: 'viewingVc',
          GET_VC: 'gettingVc',
        },
      },
      viewingVc: {
        entry: ['viewVcFromParent'],
        on: {
          DISMISS: 'idle',
        },
      },
      addingVc: {
        invoke: {
          id: 'AddVcModal',
          src: AddVcModalMachine,
          onDone: '.storing',
        },
        on: {
          DISMISS: 'idle',
        },
        initial: 'waitingForvcKey',
        states: {
          waitingForvcKey: {},
          storing: {
            entry: ['storeVcItem'],
            on: {
              STORE_RESPONSE: {
                target: 'addVcSuccessful',
                actions: ['sendVcAdded'],
              },
            },
          },
          addVcSuccessful: {
            on: {
              DISMISS: '#idle',
            },
          },
        },
      },
      gettingVc: {
        invoke: {
          id: 'GetVcModal',
          src: GetVcModalMachine,
          onDone: 'addingVc',
        },
        on: {
          DISMISS: 'idle',
        },
        initial: 'waitingForvcKey',
        states: {
          waitingForvcKey: {},
        },
      },
    },
  },
  {
    actions: {
      viewVcFromParent: sendParent((_context, event: ViewVcEvent) =>
        model.events.VIEW_VC(event.vcItemActor)
      ),

      getOnboardingStatus: send(
        () => StoreEvents.GET(ONBOARDING_STATUS_STORE_KEY),
        { to: (context) => context.serviceRefs.store }
      ),

      completeOnboarding: send(
        () => StoreEvents.SET(ONBOARDING_STATUS_STORE_KEY, true),
        { to: (context) => context.serviceRefs.store }
      ),

      storeVcItem: send(
        (_context, event) => {
          return StoreEvents.PREPEND(
            MY_VCS_STORE_KEY,
            (event as DoneInvokeEvent<string>).data
          );
        },
        { to: (context) => context.serviceRefs.store }
      ),

      sendVcAdded: send(
        (_context, event) => VcEvents.VC_ADDED(event.response as string),
        {
          to: (context) => context.serviceRefs.vc,
        }
      ),
    },

    guards: {
      isOnboardingDone: (_context, event: StoreResponseEvent) => {
        return event.response === true;
      },
    },
  }
);

export function createMyVcsTabMachine(serviceRefs: AppServices) {
  return MyVcsTabMachine.withContext({
    ...MyVcsTabMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof MyVcsTabMachine>;

export function selectAddVcModal(state: State) {
  return state.children.AddVcModal as ActorRefFrom<typeof AddVcModalMachine>;
}

export function selectGetVcModal(state: State) {
  return state.children.GetVcModal as ActorRefFrom<typeof GetVcModalMachine>;
}

export function selectIsOnboarding(state: State) {
  return state.matches('onboarding');
}

export function selectIsRequestSuccessful(state: State) {
  return state.matches('addingVc.addVcSuccessful');
}
