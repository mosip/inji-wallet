import { createContext } from 'react';
import { ActorRefFrom, InterpreterFrom } from 'xstate';
import { activityLogMachine } from '../machines/activityLog';
import { appMachine } from '../machines/app';
import { authMachine } from '../machines/auth';
import { requestMachine } from '../machines/openIdBle/request/requestMachine';
import { scanMachine } from '../machines/openIdBle/scan/scanMachine';
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
  request: ActorRefFrom<typeof requestMachine>;
  scan: ActorRefFrom<typeof scanMachine>;
  revoke: ActorRefFrom<typeof revokeVidsMachine>;
}
