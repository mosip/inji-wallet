import { createContext } from 'react';
import { ActorRefFrom, InterpreterFrom } from 'xstate';
import { activityLogMachine } from '../machines/activityLog';
import { appMachine } from '../machines/app';
import { authMachine } from '../machines/auth';
import { requestMachine } from '../machines/request';
import { requestMachine as bleRequestMachine } from '../machines/openIdBle/request';
import { scanMachine as bleScanMachine } from '../machines/openIdBle/scan';
import { scanMachine } from '../machines/scan';
import { settingsMachine } from '../machines/settings';
import { storeMachine } from '../machines/store';
import { vcMachine } from '../machines/vc';
import { revokeVidsMachine } from '../machines/revoke';

export const GlobalContext = createContext({} as GlobalServices);

export interface GlobalServices {
  appService: InterpreterFrom<typeof appMachine>;
}

export interface AppServices {
  store: ActorRefFrom<typeof storeMachine>;
  auth: ActorRefFrom<typeof authMachine>;
  vc: ActorRefFrom<typeof vcMachine>;
  settings: ActorRefFrom<typeof settingsMachine>;
  activityLog: ActorRefFrom<typeof activityLogMachine>;
  request: ActorRefFrom<typeof requestMachine & typeof bleRequestMachine>;
  scan: ActorRefFrom<typeof scanMachine & typeof bleScanMachine>;
  revoke: ActorRefFrom<typeof revokeVidsMachine>;
}
