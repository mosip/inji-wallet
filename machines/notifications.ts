import { createModel } from 'xstate/lib/model';

const model = createModel(
  {},
  {
    events: {
      MARK_READ: (index: number) => ({ index }),
      STORE_READY: () => ({}),
    },
  }
);

export const notificationsMachine = model.createMachine({
  id: 'notifications',
  context: model.initialContext,
  initial: 'init',
  states: {
    init: {
      on: {},
    },
    idle: {},
  },
});

interface Notification {
  timestamp: Date;
  message: string;
  isRead: boolean;
}
