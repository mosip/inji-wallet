import { EventFrom, send, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { AppServices } from '../shared/GlobalContext';
import { ACTIVITY_LOG_STORE_KEY } from '../shared/constants';
import { StoreEvents } from './store';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    activities: [] as ActivityLog[],
  },
  {
    events: {
      STORE_RESPONSE: (response: any) => ({ response }),
      LOG_ACTIVITY: (log: ActivityLog) => ({ log }),
      REFRESH: () => ({}),
    },
  }
);

export const ActivityLogEvents = model.events;

type StoreResponseEvent = EventFrom<typeof model, 'STORE_RESPONSE'>;
type LogActivityEvent = EventFrom<typeof model, 'LOG_ACTIVITY'>;

export const activityLogMachine = model.createMachine(
  {
    id: 'activityLog',
    context: model.initialContext,
    initial: 'init',
    states: {
      init: {
        entry: ['loadActivities'],
        on: {
          STORE_RESPONSE: {
            target: 'ready',
            actions: ['setActivities', sendParent('READY')],
          },
        },
      },
      ready: {
        initial: 'idle',
        states: {
          idle: {
            on: {
              LOG_ACTIVITY: 'logging',
              REFRESH: 'refreshing',
            },
          },
          logging: {
            entry: ['storeActivity'],
            on: {
              STORE_RESPONSE: {
                target: 'idle',
                actions: ['prependActivity'],
              },
            },
          },
          refreshing: {
            entry: ['loadActivities'],
            on: {
              STORE_RESPONSE: {
                target: 'idle',
                actions: ['setActivities'],
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      loadActivities: send(StoreEvents.GET(ACTIVITY_LOG_STORE_KEY), {
        to: (context) => context.serviceRefs.store,
      }),

      setActivities: model.assign({
        activities: (_, event: StoreResponseEvent) => event.response || [],
      }),

      storeActivity: send(
        (_, event: LogActivityEvent) =>
          StoreEvents.PREPEND(ACTIVITY_LOG_STORE_KEY, event.log),
        { to: (context) => context.serviceRefs.store }
      ),

      prependActivity: model.assign({
        activities: (context, event: StoreResponseEvent) => [
          event.response,
          ...context.activities,
        ],
      }),
    },
  }
);

export function createActivityLogMachine(serviceRefs: AppServices) {
  return activityLogMachine.withContext({
    ...activityLogMachine.context,
    serviceRefs,
  });
}

export interface ActivityLog {
  _vcKey: string;
  timestamp: number;
  deviceName: string;
  vcLabel: string;
  action: ActivityLogAction;
}

export type ActivityLogAction =
  | 'shared'
  | 'received'
  | 'deleted'
  | 'downloaded';

type State = StateFrom<typeof activityLogMachine>;

export function selectActivities(state: State) {
  return state.context.activities;
}

export function selectIsRefreshing(state: State) {
  return state.matches('ready.refreshing');
}
