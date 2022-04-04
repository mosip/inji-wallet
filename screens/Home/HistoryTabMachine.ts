import { createModel } from 'xstate/lib/model';
import { ActivityLog } from '../../machines/activityLog';
import { AppServices } from '../../shared/GlobalContext';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    activities: [] as ActivityLog[],
  },
  {
    events: {},
  }
);

export const HistoryTabEvents = model.events;

export const HistoryTabMachine = model.createMachine(
  {
    id: 'HistoryTab',
    context: model.initialContext,
    initial: 'idle',
    states: {
      idle: {},
    },
  },
  {
    actions: {},
  }
);

export function createHistoryTabMachine(serviceRefs: AppServices) {
  return HistoryTabMachine.withContext({
    ...HistoryTabMachine.context,
    serviceRefs,
  });
}
