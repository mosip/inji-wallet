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
    loadMyVcs: 'CONFIRM';
    setMyVcs: 'STORE_RESPONSE';
    setScanData: 'SCANNING_DONE';
    setSelectedVc: 'SELECT_VC';
  };
  'eventsCausingServices': {};
  'eventsCausingGuards': {};
  'eventsCausingDelays': {};
  'matchesStates':
    | 'done'
    | 'faceAuth'
    | 'idle'
    | 'invalidIdentity'
    | 'showWarning'
    | 'showvcList';
  'tags': never;
}
