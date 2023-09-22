// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.issuersMachine.displayIssuers:invocation[0]': {
      type: 'done.invoke.issuersMachine.displayIssuers:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.downloadCredentials:invocation[0]': {
      type: 'done.invoke.issuersMachine.downloadCredentials:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.downloadIssuerConfig:invocation[0]': {
      type: 'done.invoke.issuersMachine.downloadIssuerConfig:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.generateKeyPair:invocation[0]': {
      type: 'done.invoke.issuersMachine.generateKeyPair:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.performAuthorization:invocation[0]': {
      type: 'done.invoke.issuersMachine.performAuthorization:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.verifyingCredential:invocation[0]': {
      type: 'done.invoke.issuersMachine.verifyingCredential:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.issuersMachine.displayIssuers:invocation[0]': {
      type: 'error.platform.issuersMachine.displayIssuers:invocation[0]';
      data: unknown;
    };
    'error.platform.issuersMachine.performAuthorization:invocation[0]': {
      type: 'error.platform.issuersMachine.performAuthorization:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    downloadCredential: 'done.invoke.issuersMachine.downloadCredentials:invocation[0]';
    downloadIssuerConfig: 'done.invoke.issuersMachine.downloadIssuerConfig:invocation[0]';
    downloadIssuersList: 'done.invoke.issuersMachine.displayIssuers:invocation[0]';
    generateKeyPair: 'done.invoke.issuersMachine.generateKeyPair:invocation[0]';
    invokeAuthorization: 'done.invoke.issuersMachine.performAuthorization:invocation[0]';
    verifyCredential: 'done.invoke.issuersMachine.verifyingCredential:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    getKeyPairFromStore: 'done.invoke.issuersMachine.performAuthorization:invocation[0]';
    loadKeyPair: 'done.invoke.issuersMachine.performAuthorization:invocation[0]';
    logDownloaded: 'done.invoke.issuersMachine.verifyingCredential:invocation[0]';
    resetError: 'RESET_ERROR' | 'TRY_AGAIN';
    setError: 'error.platform.issuersMachine.displayIssuers:invocation[0]';
    setIssuers: 'done.invoke.issuersMachine.displayIssuers:invocation[0]';
    setPrivateKey: 'done.invoke.issuersMachine.generateKeyPair:invocation[0]';
    setPublicKey: 'done.invoke.issuersMachine.generateKeyPair:invocation[0]';
    setSelectedIssuers: 'done.invoke.issuersMachine.downloadIssuerConfig:invocation[0]';
    setTokenResponse: 'done.invoke.issuersMachine.performAuthorization:invocation[0]';
    setVerifiableCredential: 'done.invoke.issuersMachine.downloadCredentials:invocation[0]';
    storeKeyPair: 'done.invoke.issuersMachine.generateKeyPair:invocation[0]';
    storeVcMetaContext: 'done.invoke.issuersMachine.verifyingCredential:invocation[0]';
    storeVcsContext: 'done.invoke.issuersMachine.verifyingCredential:invocation[0]';
    storeVerifiableCredentialData: 'done.invoke.issuersMachine.verifyingCredential:invocation[0]';
    storeVerifiableCredentialMeta: 'done.invoke.issuersMachine.verifyingCredential:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasKeyPair: 'CHECK_KEY_PAIR';
    isCustomSecureKeystore: 'done.invoke.issuersMachine.generateKeyPair:invocation[0]';
  };
  eventsCausingServices: {
    downloadCredential:
      | 'CHECK_KEY_PAIR'
      | 'done.invoke.issuersMachine.generateKeyPair:invocation[0]'
      | 'error.platform.issuersMachine.performAuthorization:invocation[0]';
    downloadIssuerConfig: 'SELECTED_ISSUER';
    downloadIssuersList: 'TRY_AGAIN' | 'xstate.init';
    generateKeyPair: 'CHECK_KEY_PAIR';
    invokeAuthorization: 'done.invoke.issuersMachine.downloadIssuerConfig:invocation[0]';
    verifyCredential: 'done.invoke.issuersMachine.downloadCredentials:invocation[0]';
  };
  matchesStates:
    | 'checkKeyPair'
    | 'displayIssuers'
    | 'done'
    | 'downloadCredentials'
    | 'downloadIssuerConfig'
    | 'error'
    | 'generateKeyPair'
    | 'idle'
    | 'performAuthorization'
    | 'selectingIssuer'
    | 'storing'
    | 'verifyingCredential';
  tags: never;
}
