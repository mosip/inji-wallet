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
    'error.platform.store.resettingStorage:invocation[0]': {
      type: 'error.platform.store.resettingStorage:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    clear: 'done.invoke.store.resettingStorage:invocation[0]';
    generateEncryptionKey: 'done.invoke.store.generatingEncryptionKey:invocation[0]';
    getEncryptionKey: 'done.invoke.store.gettingEncryptionKey:invocation[0]';
    store: 'done.invoke._store';
  };
  'missingImplementations': {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  'eventsCausingActions': {
    forwardStoreRequest:
      | 'APPEND'
      | 'CLEAR'
      | 'GET'
      | 'PREPEND'
      | 'REMOVE'
      | 'SET';
    notifyParent:
      | 'KEY_RECEIVED'
      | 'done.invoke.store.resettingStorage:invocation[0]';
    setEncryptionKey: 'KEY_RECEIVED';
  };
  'eventsCausingServices': {
    clear: 'KEY_RECEIVED';
    generateEncryptionKey: 'ERROR';
    getEncryptionKey: 'xstate.init';
    store: 'KEY_RECEIVED' | 'done.invoke.store.resettingStorage:invocation[0]';
  };
  'eventsCausingGuards': {};
  'eventsCausingDelays': {};
  'matchesStates':
    | 'generatingEncryptionKey'
    | 'gettingEncryptionKey'
    | 'ready'
    | 'resettingStorage';
  'tags': never;
}
