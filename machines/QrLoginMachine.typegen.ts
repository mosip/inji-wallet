// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke.QrLogin.requestingJwtToken:invocation[0]': {
      type: 'done.invoke.QrLogin.requestingJwtToken:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.QrLogin.requestingJwtToken:invocation[0]': {
      type: 'error.platform.QrLogin.requestingJwtToken:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    requestingJwtToken: 'done.invoke.QrLogin.requestingJwtToken:invocation[0]';
  };
  'missingImplementations': {
    actions: '';
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    '':
      | 'done.invoke.QrLogin.requestingJwtToken:invocation[0]'
      | 'error.platform.QrLogin.requestingJwtToken:invocation[0]';
    'loadMyVcs': 'CONFIRM';
    'setMyVcs': 'STORE_RESPONSE';
    'setScanData': 'SCANNING_DONE';
    'setSelectedVc': 'SELECT_VC';
  };
  'eventsCausingDelays': {};
  'eventsCausingGuards': {};
  'eventsCausingServices': {
    requestingJwtToken: 'FACE_VALID';
  };
  'matchesStates':
    | 'done'
    | 'faceAuth'
    | 'idle'
    | 'invalidIdentity'
    | 'loadMyVcs'
    | 'requestingJwtToken'
    | 'showWarning'
    | 'showvcList';
  'tags': never;
}
