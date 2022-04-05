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
import {  vcItemMachine } from '../../machines/vcItem';
import { AppServices } from '../../shared/GlobalContext';
import {
  MY_VCS_STORE_KEY,
  ONBOARDING_STATUS_STORE_KEY,
} from '../../shared/constants';
import { AddVcModalMachine } from './MyVcs/AddVcModalMachine';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
  },
  {
    events: {
      REFRESH: () => ({}),
      VIEW_VC: (vcItemActor: ActorRefFrom<typeof  vcItemMachine>) => ({
        vcItemActor,
      }),
      DISMISS: () => ({}),
      STORE_RESPONSE: (response?: any) => ({ response }),
      ADD_VC: () => ({}),
      ONBOARDING_DONE: () => ({}),
    },
  }
);

export const MyVcsTabEvents = model.events;

type ViewVcEvent = EventFrom<typeof model, 'VIEW_VC'>;

export const MyVcsTabMachine = model.createMachine(
  {
    id: 'MyVcsTab',
    context: model.initialContext,
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
        },
      },
      viewingVc: {
        entry: [
          sendParent((_, event: ViewVcEvent) =>
            model.events.VIEW_VC(event.vcItemActor)
          ),
        ],
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
          }
        },
      },
    },
  },
  {
    actions: {
      getOnboardingStatus: send(
        () => StoreEvents.GET(ONBOARDING_STATUS_STORE_KEY),
        { to: (context) => context.serviceRefs.store }
      ),

      completeOnboarding: send(
        () => StoreEvents.SET(ONBOARDING_STATUS_STORE_KEY, true),
        { to: (context) => context.serviceRefs.store }
      ),

      storeVcItem: send(
        (_, _event: any) => {
          const event: DoneInvokeEvent<string> = _event;
          return StoreEvents.PREPEND(MY_VCS_STORE_KEY, event.data);
        },
        { to: (context) => context.serviceRefs.store }
      ),

      sendVcAdded: send(
        (_, event: StoreResponseEvent) => VcEvents.VC_ADDED(event.response),
        { to: (context) => context.serviceRefs.vc }
      ),
    },

    guards: {
      isOnboardingDone: (_, event: StoreResponseEvent) => {
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

export function selectIsOnboarding(state: State) {
  return state.matches('onboarding');
}

export function selectIsRequestSuccessful(state: State) {
  return state.matches('addingVc.addVcSuccessful');
}
