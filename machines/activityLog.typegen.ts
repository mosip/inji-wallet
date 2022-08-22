// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
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
  'eventsCausingActions': {
    loadActivities: 'REFRESH' | 'xstate.init';
    prependActivity: 'STORE_RESPONSE';
    setActivities: 'STORE_RESPONSE';
    storeActivity: 'LOG_ACTIVITY';
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
