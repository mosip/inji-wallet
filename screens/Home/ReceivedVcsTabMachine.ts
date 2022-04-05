import {
  ActorRefFrom,
  EventFrom,
  sendParent
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { createVcItemMachine, vcItemMachine } from '../../machines/vcItem';
import { AppServices } from '../../shared/GlobalContext';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    error: '',
  },
  {
    events: {
      VIEW_VC: (vcItemActor: ActorRefFrom<typeof vcItemMachine>) => ({
        vcItemActor,
      }),
      REFRESH: () => ({}),
      DISMISS: () => ({}),
      STORE_RESPONSE: (response?: any) => ({ response }),
      STORE_ERROR: (error: Error) => ({ error }),
      ERROR: (error: Error) => ({ error }),
      GET_RECEIVED_VCS_RESPONSE: (vcKeys: string[]) => ({ vcKeys }),
    },
  }
);

export const ReceivedVcsTabEvents = model.events;

type ErrorEvent = EventFrom<typeof model, 'ERROR'>;
type ViewVcEvent = EventFrom<typeof model, 'VIEW_VC'>;
type GetReceivedVcListResponseEvent = EventFrom<
  typeof model,
  'GET_RECEIVED_VCS_RESPONSE'
>;

export const ReceivedVcsTabMachine = model.createMachine(
  {
    id: 'ReceivedVcsTab',
    context: model.initialContext,
    initial: 'idle',
    states: {
      idle: {
        on: {
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
    },
  },
  {
    actions: {},
  }
);

export function createReceivedVcsTabMachine(serviceRefs: AppServices) {
  return ReceivedVcsTabMachine.withContext({
    ...ReceivedVcsTabMachine.context,
    serviceRefs,
  });
}
