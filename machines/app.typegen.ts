// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    getAppInfo: 'done.invoke.app.init.info:invocation[0]';
    getBackendInfo: 'done.invoke.app.init.devinfo:invocation[0]';
    checkFocusState: 'done.invoke.app.ready.focus:invocation[0]';
    checkNetworkState: 'done.invoke.app.ready.network:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  'eventsCausingActions': {
    setAppInfo: 'APP_INFO_RECEIVED';
    setBackendInfo: 'BACKEND_INFO_RECEIVED';
    requestDeviceInfo: 'REQUEST_DEVICE_INFO';
    spawnStoreActor: 'xstate.init';
    logStoreEvents: 'xstate.init';
    spawnServiceActors: 'READY';
    logServiceEvents: 'READY';
    forwardToServices: 'ACTIVE' | 'INACTIVE' | 'ONLINE' | 'OFFLINE';
  };
  'eventsCausingServices': {
    getAppInfo: 'READY';
    getBackendInfo: 'APP_INFO_RECEIVED';
    checkFocusState: 'BACKEND_INFO_RECEIVED';
    checkNetworkState: 'BACKEND_INFO_RECEIVED';
  };
  'eventsCausingGuards': {};
  'eventsCausingDelays': {};
  'matchesStates':
    | 'init'
    | 'init.store'
    | 'init.services'
    | 'init.info'
    | 'init.devinfo'
    | 'ready'
    | 'ready.focus'
    | 'ready.focus.checking'
    | 'ready.focus.active'
    | 'ready.focus.inactive'
    | 'ready.network'
    | 'ready.network.checking'
    | 'ready.network.online'
    | 'ready.network.offline'
    | {
        init?: 'store' | 'services' | 'info' | 'devinfo';
        ready?:
          | 'focus'
          | 'network'
          | {
              focus?: 'checking' | 'active' | 'inactive';
              network?: 'checking' | 'online' | 'offline';
            };
      };
  'tags': never;
}
