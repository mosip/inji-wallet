// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    checkFocusState: 'done.invoke.app.ready.focus:invocation[0]';
    checkNetworkState: 'done.invoke.app.ready.network:invocation[0]';
    getAppInfo: 'done.invoke.app.init.info:invocation[0]';
    getBackendInfo: 'done.invoke.app.init.devinfo:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    forwardToServices: 'ACTIVE' | 'INACTIVE' | 'OFFLINE' | 'ONLINE';
    logServiceEvents: 'READY';
    logStoreEvents: 'xstate.init';
    requestDeviceInfo: 'REQUEST_DEVICE_INFO';
    setAppInfo: 'APP_INFO_RECEIVED';
    setBackendInfo: 'BACKEND_INFO_RECEIVED';
    spawnServiceActors: 'READY';
    spawnStoreActor: 'xstate.init';
  };
  'eventsCausingDelays': {};
  'eventsCausingGuards': {};
  'eventsCausingServices': {
    checkFocusState: 'BACKEND_INFO_RECEIVED';
    checkNetworkState: 'BACKEND_INFO_RECEIVED';
    getAppInfo: 'READY';
    getBackendInfo: 'APP_INFO_RECEIVED';
  };
  'matchesStates':
    | 'init'
    | 'init.devinfo'
    | 'init.info'
    | 'init.services'
    | 'init.store'
    | 'ready'
    | 'ready.focus'
    | 'ready.focus.active'
    | 'ready.focus.checking'
    | 'ready.focus.inactive'
    | 'ready.network'
    | 'ready.network.checking'
    | 'ready.network.offline'
    | 'ready.network.online'
    | {
        init?: 'devinfo' | 'info' | 'services' | 'store';
        ready?:
          | 'focus'
          | 'network'
          | {
              focus?: 'active' | 'checking' | 'inactive';
              network?: 'checking' | 'offline' | 'online';
            };
      };
  'tags': never;
}
