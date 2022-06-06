// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'eventsCausingActions': {
    setEncryptionKey: 'KEY_RECEIVED';
    forwardStoreRequest:
      | 'GET'
      | 'SET'
      | 'APPEND'
      | 'PREPEND'
      | 'REMOVE'
      | 'CLEAR';
    notifyParent:
      | 'KEY_RECEIVED'
      | 'done.invoke.store.resettingStorage:invocation[0]';
  };
  'internalEvents': {
    'error.platform.store.resettingStorage:invocation[0]': {
      type: 'error.platform.store.resettingStorage:invocation[0]';
      data: unknown;
    };
    'done.invoke.store.resettingStorage:invocation[0]': {
      type: 'done.invoke.store.resettingStorage:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.init': { type: 'xstate.init' };
    'done.invoke._store': {
      type: 'done.invoke._store';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform._store': { type: 'error.platform._store'; data: unknown };
  };
  'invokeSrcNameMap': {
    getEncryptionKey: 'done.invoke.store.gettingEncryptionKey:invocation[0]';
    generateEncryptionKey: 'done.invoke.store.generatingEncryptionKey:invocation[0]';
    clear: 'done.invoke.store.resettingStorage:invocation[0]';
    store: 'done.invoke._store';
  };
  'missingImplementations': {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  'eventsCausingServices': {
    getEncryptionKey: 'xstate.init';
    store: 'KEY_RECEIVED' | 'done.invoke.store.resettingStorage:invocation[0]';
    generateEncryptionKey: 'ERROR';
    clear: 'KEY_RECEIVED';
  };
  'eventsCausingGuards': {};
  'eventsCausingDelays': {};
  'matchesStates':
    | 'gettingEncryptionKey'
    | 'generatingEncryptionKey'
    | 'resettingStorage'
    | 'ready';
  'tags': never;
}
