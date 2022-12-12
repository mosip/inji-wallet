// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke.QrLogin.linkTransaction:invocation[0]': {
      type: 'done.invoke.QrLogin.linkTransaction:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
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
    linkTransaction: 'done.invoke.QrLogin.linkTransaction:invocation[0]';
    requestingJwtToken: 'done.invoke.QrLogin.requestingJwtToken:invocation[0]';
  };
  'missingImplementations': {
    actions: '';
    delays: never;
    guards: never;
    services: 'requestingJwtToken';
  };
  'eventsCausingActions': {
    '':
      | 'done.invoke.QrLogin.requestingJwtToken:invocation[0]'
      | 'error.platform.QrLogin.requestingJwtToken:invocation[0]';
    'loadMyVcs':
      | 'CONFIRM'
      | 'done.invoke.QrLogin.linkTransaction:invocation[0]';
    'setMyVcs': 'STORE_RESPONSE';
    'setScanData': 'SCANNING_DONE';
    'setSelectedVc': 'SELECT_VC';
    'setlinkTransactionResponse': 'done.invoke.QrLogin.linkTransaction:invocation[0]';
  };
  'eventsCausingDelays': {};
  'eventsCausingGuards': {};
  'eventsCausingServices': {
    linkTransaction: never;
    requestingJwtToken: never;
  };
  'matchesStates':
    | 'done'
    | 'faceAuth'
    | 'idle'
    | 'invalidIdentity'
    | 'linkTransaction'
    | 'loadMyVcs'
    | 'requestConsent'
    | 'requestingJwtToken'
    | 'showWarning'
    | 'showvcList';
  'tags': never;
}
