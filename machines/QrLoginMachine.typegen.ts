// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke.QrLogin.linkTransaction:invocation[0]': {
      type: 'done.invoke.QrLogin.linkTransaction:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.QrLogin.sendingAuthenticate:invocation[0]': {
      type: 'done.invoke.QrLogin.sendingAuthenticate:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.QrLogin.linkTransaction:invocation[0]': {
      type: 'error.platform.QrLogin.linkTransaction:invocation[0]';
      data: unknown;
    };
    'error.platform.QrLogin.sendingAuthenticate:invocation[0]': {
      type: 'error.platform.QrLogin.sendingAuthenticate:invocation[0]';
      data: unknown;
    };
    'error.platform.QrLogin.sendingConsent:invocation[0]': {
      type: 'error.platform.QrLogin.sendingConsent:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    linkTransaction: 'done.invoke.QrLogin.linkTransaction:invocation[0]';
    sendAuthenticate: 'done.invoke.QrLogin.sendingAuthenticate:invocation[0]';
    sendConsent: 'done.invoke.QrLogin.sendingConsent:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    SetErrorMessage:
      | 'error.platform.QrLogin.linkTransaction:invocation[0]'
      | 'error.platform.QrLogin.sendingAuthenticate:invocation[0]'
      | 'error.platform.QrLogin.sendingConsent:invocation[0]';
    expandLinkTransResp: 'done.invoke.QrLogin.linkTransaction:invocation[0]';
    forwardToParent: 'DISMISS';
    loadMyVcs: 'done.invoke.QrLogin.linkTransaction:invocation[0]';
    loadThumbprint: 'CONFIRM';
    resetLinkTransactionId: 'GET';
    resetSelectedVoluntaryClaims: 'GET';
    setClaims: 'done.invoke.QrLogin.linkTransaction:invocation[0]';
    setConsentClaims: 'TOGGLE_CONSENT_CLAIM';
    setLinkedTransactionId: 'done.invoke.QrLogin.sendingAuthenticate:invocation[0]';
    setMyVcs: 'STORE_RESPONSE';
    setScanData: 'GET';
    setSelectedVc: 'SELECT_VC';
    setThumbprint: 'STORE_RESPONSE';
    setlinkTransactionResponse: 'done.invoke.QrLogin.linkTransaction:invocation[0]';
  };
  'eventsCausingDelays': {};
  'eventsCausingGuards': {};
  'eventsCausingServices': {
    linkTransaction: 'GET';
    sendAuthenticate: never;
    sendConsent: 'STORE_RESPONSE';
  };
  'matchesStates':
    | 'ShowError'
    | 'done'
    | 'faceAuth'
    | 'invalidIdentity'
    | 'linkTransaction'
    | 'loadMyVcs'
    | 'loadingThumbprint'
    | 'requestConsent'
    | 'sendingAuthenticate'
    | 'sendingConsent'
    | 'showvcList'
    | 'success'
    | 'waitingForData';
  'tags': never;
}
