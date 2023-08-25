// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke._store': {
      type: 'done.invoke._store';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.store.resettingStorage:invocation[0]': {
      type: 'done.invoke.store.resettingStorage:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform._store': { type: 'error.platform._store'; data: unknown };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    checkStorageInitialisedOrNot: 'done.invoke.store.checkStorageInitialisation:invocation[0]';
    clear: 'done.invoke.store.resettingStorage:invocation[0]';
    generateEncryptionKey: 'done.invoke.store.generatingEncryptionKey:invocation[0]';
    getEncryptionKey: 'done.invoke.store.gettingEncryptionKey:invocation[0]';
    store: 'done.invoke._store';
  };
  'missingImplementations': {
    actions: 'logKey';
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    forwardStoreRequest:
      | 'APPEND'
      | 'CLEAR'
      | 'GET'
      | 'PREPEND'
      | 'REMOVE'
      | 'REMOVE_ITEMS'
      | 'REMOVE_VC_METADATA'
      | 'SET'
      | 'UPDATE';
    logKey: 'KEY_RECEIVED';
    notifyParent:
      | 'KEY_RECEIVED'
      | 'done.invoke.store.resettingStorage:invocation[0]';
    resetIsTamperedVc: 'RESET_IS_TAMPERED';
    setEncryptionKey: 'KEY_RECEIVED';
    setIsTamperedVc: 'TAMPERED_VC';
  };
  'eventsCausingDelays': {};
  'eventsCausingGuards': {};
  'eventsCausingServices': {
    checkStorageInitialisedOrNot: 'ERROR';
    clear: 'KEY_RECEIVED';
    generateEncryptionKey: 'IGNORE' | 'READY';
    getEncryptionKey: 'TRY_AGAIN' | 'xstate.init';
    store: 'KEY_RECEIVED' | 'done.invoke.store.resettingStorage:invocation[0]';
  };
  'matchesStates':
    | 'checkStorageInitialisation'
    | 'failedReadingKey'
    | 'generatingEncryptionKey'
    | 'gettingEncryptionKey'
    | 'ready'
    | 'resettingStorage';
  'tags': never;
}
