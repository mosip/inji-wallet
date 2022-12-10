// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {};
  'missingImplementations': {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    loadMyVcs: 'CONFIRM';
    setMyVcs: 'STORE_RESPONSE';
    setScanData: 'SCANNING_DONE';
    setSelectedVc: 'SELECT_VC';
  };
  'eventsCausingDelays': {};
  'eventsCausingGuards': {};
  'eventsCausingServices': {};
  'matchesStates':
    | 'done'
    | 'faceAuth'
    | 'idle'
    | 'invalidIdentity'
    | 'loadMyVcs'
    | 'showWarning'
    | 'showvcList';
  'tags': never;
}
