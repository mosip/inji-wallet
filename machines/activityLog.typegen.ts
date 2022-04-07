// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'eventsCausingActions': {
    setActivities: 'STORE_RESPONSE';
    prependActivity: 'STORE_RESPONSE';
    loadActivities: 'REFRESH';
    storeActivity: 'LOG_ACTIVITY';
  };
  'internalEvents': {
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {};
  'missingImplementations': {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  'eventsCausingServices': {};
  'eventsCausingGuards': {};
  'eventsCausingDelays': {};
  'matchesStates':
    | 'init'
    | 'ready'
    | 'ready.idle'
    | 'ready.logging'
    | 'ready.refreshing'
    | { ready?: 'idle' | 'logging' | 'refreshing' };
  'tags': never;
}
