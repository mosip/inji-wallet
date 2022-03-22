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
import { VidEvents } from '../../machines/vid';
import { vidItemMachine } from '../../machines/vidItem';
import { AppServices } from '../../shared/GlobalContext';
import {
  MY_VIDS_STORE_KEY,
  ONBOARDING_STATUS_STORE_KEY,
} from '../../shared/constants';
import { AddVidModalMachine } from './MyVids/AddVidModalMachine';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
  },
  {
    events: {
      REFRESH: () => ({}),
      VIEW_VID: (vidItemActor: ActorRefFrom<typeof vidItemMachine>) => ({
        vidItemActor,
      }),
      DISMISS: () => ({}),
      STORE_RESPONSE: (response?: any) => ({ response }),
      ADD_VID: () => ({}),
      ONBOARDING_DONE: () => ({}),
    },
  }
);

export const MyVidsTabEvents = model.events;

type ViewVidEvent = EventFrom<typeof model, 'VIEW_VID'>;

export const MyVidsTabMachine = model.createMachine(
  {
    id: 'MyVidsTab',
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
          ADD_VID: {
            target: 'addingVid',
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
          ADD_VID: 'addingVid',
          VIEW_VID: 'viewingVid',
        },
      },
      viewingVid: {
        entry: [
          sendParent((_, event: ViewVidEvent) =>
            model.events.VIEW_VID(event.vidItemActor)
          ),
        ],
        on: {
          DISMISS: 'idle',
        },
      },
      addingVid: {
        invoke: {
          id: 'AddVidModal',
          src: AddVidModalMachine,
          onDone: '.storing',
        },
        on: {
          DISMISS: 'idle',
        },
        initial: 'waitingForVidKey',
        states: {
          waitingForVidKey: {},
          storing: {
            entry: ['storeVidItem'],
            on: {
              STORE_RESPONSE: {
                target: '#idle',
                actions: ['sendVidAdded'],
              },
            },
          },
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

      storeVidItem: send(
        (_, _event: any) => {
          const event: DoneInvokeEvent<string> = _event;
          return StoreEvents.PREPEND(MY_VIDS_STORE_KEY, event.data);
        },
        { to: (context) => context.serviceRefs.store }
      ),

      sendVidAdded: send(
        (_, event: StoreResponseEvent) => VidEvents.VID_ADDED(event.response),
        { to: (context) => context.serviceRefs.vid }
      ),
    },

    guards: {
      isOnboardingDone: (_, event: StoreResponseEvent) => {
        return event.response === true;
      },
    },
  }
);

export function createMyVidsTabMachine(serviceRefs: AppServices) {
  return MyVidsTabMachine.withContext({
    ...MyVidsTabMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof MyVidsTabMachine>;

export function selectAddVidModal(state: State) {
  return state.children.AddVidModal as ActorRefFrom<typeof AddVidModalMachine>;
}

export function selectIsOnboarding(state: State) {
  return state.matches('onboarding');
}
