// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke.QrLogin.authRequest:invocation[0]': {
      type: 'done.invoke.QrLogin.authRequest:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.QrLogin.linkTransaction:invocation[0]': {
      type: 'done.invoke.QrLogin.linkTransaction:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.QrLogin.authRequest:invocation[0]': {
      type: 'error.platform.QrLogin.authRequest:invocation[0]';
      data: unknown;
    };
    'error.platform.QrLogin.linkTransaction:invocation[0]': {
      type: 'error.platform.QrLogin.linkTransaction:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    linkTransaction: 'done.invoke.QrLogin.linkTransaction:invocation[0]';
    requestAuthFactor: 'done.invoke.QrLogin.authRequest:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    SetErrorMessage:
      | 'error.platform.QrLogin.authRequest:invocation[0]'
      | 'error.platform.QrLogin.linkTransaction:invocation[0]';
    expandLinkTransResp: 'done.invoke.QrLogin.linkTransaction:invocation[0]';
    loadMyVcs: 'CONFIRM';
    setMyVcs: 'STORE_RESPONSE';
    setRequestAuthResponse: 'done.invoke.QrLogin.authRequest:invocation[0]';
    setScanData: 'SCANNING_DONE';
    setSelectedVc: 'SELECT_VC';
    setlinkTransactionResponse: 'done.invoke.QrLogin.linkTransaction:invocation[0]';
  };
  'eventsCausingDelays': {};
  'eventsCausingGuards': {};
  'eventsCausingServices': {
    linkTransaction: 'SCANNING_DONE';
    requestAuthFactor: 'CONFIRM';
  };
  'matchesStates':
    | 'ShowError'
    | 'authRequest'
    | 'done'
    | 'faceAuth'
    | 'idle'
    | 'invalidIdentity'
    | 'linkTransaction'
    | 'loadMyVcs'
    | 'requestConsent'
    | 'showWarning'
    | 'showvcList';
  'tags': never;
}
