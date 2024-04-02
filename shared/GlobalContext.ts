import {createContext} from 'react';
import {ActorRefFrom, InterpreterFrom} from 'xstate';
import {activityLogMachine} from '../machines/activityLog';
import {appMachine} from '../machines/app';
import {authMachine} from '../machines/auth';
import {requestMachine} from '../machines/bleShare/request/requestMachine';
import {scanMachine} from '../machines/bleShare/scan/scanMachine';
import {settingsMachine} from '../machines/settings';
import {storeMachine} from '../machines/store';
import {backupMachine} from '../machines/backupAndRestore/backup';
import {backupRestoreMachine} from '../machines/backupAndRestore/backupRestore';
import {vcMetaMachine} from '../machines/VerifiableCredential/VCMetaMachine/VCMetaMachine';

export const GlobalContext = createContext({} as GlobalServices);

export interface GlobalServices {
  appService: InterpreterFrom<typeof appMachine>;
}

export interface AppServices {
  store: ActorRefFrom<typeof storeMachine>;
  auth: ActorRefFrom<typeof authMachine>;
  vcMeta: ActorRefFrom<typeof vcMetaMachine>;
  settings: ActorRefFrom<typeof settingsMachine>;
  activityLog: ActorRefFrom<typeof activityLogMachine>;
  request: ActorRefFrom<typeof requestMachine>;
  scan: ActorRefFrom<typeof scanMachine>;
  backup: ActorRefFrom<typeof backupMachine>;
  backupRestore: ActorRefFrom<typeof backupRestoreMachine>;
}
