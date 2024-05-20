// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    checkFocusState: 'done.invoke.app.ready.focus:invocation[0]';
    checkNetworkState: 'done.invoke.app.ready.network:invocation[0]';
    getAppInfo: 'done.invoke.app.init.info:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    forwardToServices: 'ACTIVE' | 'INACTIVE' | 'OFFLINE' | 'ONLINE';
    loadCredentialRegistryHostFromStorage: 'READY';
    loadCredentialRegistryInConstants: 'STORE_RESPONSE';
    loadEsignetHostFromConstants: 'STORE_RESPONSE';
    loadEsignetHostFromStorage: 'READY';
    logServiceEvents: 'READY';
    logStoreEvents:
      | 'KEY_INVALIDATE_ERROR'
      | 'RESET_KEY_INVALIDATE_ERROR_DISMISS'
      | 'xstate.init';
    requestDeviceInfo: 'REQUEST_DEVICE_INFO';
    resetKeyInvalidateError: 'READY' | 'RESET_KEY_INVALIDATE_ERROR_DISMISS';
    setAppInfo: 'APP_INFO_RECEIVED';
    setIsDecryptError: 'DECRYPT_ERROR';
    setIsReadError: 'ERROR';
    spawnServiceActors: 'READY';
    spawnStoreActor:
      | 'KEY_INVALIDATE_ERROR'
      | 'RESET_KEY_INVALIDATE_ERROR_DISMISS'
      | 'xstate.init';
    unsetIsDecryptError: 'DECRYPT_ERROR_DISMISS' | 'READY';
    unsetIsReadError: 'READY';
    updateKeyInvalidateError: 'ERROR' | 'KEY_INVALIDATE_ERROR';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    checkFocusState: 'APP_INFO_RECEIVED';
    checkNetworkState: 'APP_INFO_RECEIVED';
    getAppInfo: 'STORE_RESPONSE';
  };
  matchesStates:
    | 'init'
    | 'init.credentialRegistry'
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
    | 'waiting'
    | {
        init?: 'credentialRegistry' | 'info' | 'services' | 'store';
        ready?:
          | 'focus'
          | 'network'
          | {
              focus?: 'active' | 'checking' | 'inactive';
              network?: 'checking' | 'offline' | 'online';
            };
      };
  tags: never;
}
