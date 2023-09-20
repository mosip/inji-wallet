import { ActorRefFrom, EventFrom, sendParent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { vcItemMachine } from '../../machines/vcItem';
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
      STORE_RESPONSE: (response?: unknown) => ({ response }),
      STORE_ERROR: (error: Error) => ({ error }),
      ERROR: (error: Error) => ({ error }),
      GET_RECEIVED_VCS_RESPONSE: (vcMetadatas: string[]) => ({ vcMetadatas }),
    },
  }
);

export const ReceivedVcsTabEvents = model.events;

export const ReceivedVcsTabMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./ReceivedVcsTabMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'ReceivedVcsTab',
    initial: 'idle',
    states: {
      idle: {
        on: {
          VIEW_VC: 'viewingVc',
        },
      },
      viewingVc: {
        entry: ['viewVcFromParent'],
        on: {
          DISMISS: 'idle',
        },
      },
    },
  },
  {
    actions: {
      viewVcFromParent: sendParent((_context, event) =>
        model.events.VIEW_VC(event.vcItemActor)
      ),
    },
  }
);

export function createReceivedVcsTabMachine(serviceRefs: AppServices) {
  return ReceivedVcsTabMachine.withContext({
    ...ReceivedVcsTabMachine.context,
    serviceRefs,
  });
}
