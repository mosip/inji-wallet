// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke.settings.resetInjiProps:invocation[0]': {
      type: 'done.invoke.settings.resetInjiProps:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.settings.resetInjiProps:invocation[0]': {
      type: 'error.platform.settings.resetInjiProps:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    resetInjiProps: 'done.invoke.settings.resetInjiProps:invocation[0]';
  };
  'missingImplementations': {
    actions: 'injiTourGuide';
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    injiTourGuide:
      | 'BACK'
      | 'CANCEL'
      | 'STORE_RESPONSE'
      | 'done.invoke.settings.resetInjiProps:invocation[0]'
      | 'error.platform.settings.resetInjiProps:invocation[0]';
    requestStoredContext: 'xstate.init';
    resetCredentialRegistry: 'CANCEL' | 'UPDATE_CREDENTIAL_REGISTRY';
    setContext: 'STORE_RESPONSE';
    storeContext:
      | 'STORE_RESPONSE'
      | 'TOGGLE_BIOMETRIC_UNLOCK'
      | 'UPDATE_NAME'
      | 'UPDATE_VC_LABEL'
      | 'done.invoke.settings.resetInjiProps:invocation[0]';
    toggleBiometricUnlock: 'TOGGLE_BIOMETRIC_UNLOCK';
    updateCredentialRegistry: 'done.invoke.settings.resetInjiProps:invocation[0]';
    updateCredentialRegistryResponse: 'error.platform.settings.resetInjiProps:invocation[0]';
    updateCredentialRegistrySuccess: 'done.invoke.settings.resetInjiProps:invocation[0]';
    updateDefaults: 'STORE_RESPONSE';
    updateName: 'UPDATE_NAME';
    updatePartialDefaults: 'STORE_RESPONSE';
    updateVcLabel: 'UPDATE_VC_LABEL';
  };
  'eventsCausingDelays': {};
  'eventsCausingGuards': {
    hasData: 'STORE_RESPONSE';
    hasPartialData: 'STORE_RESPONSE';
  };
  'eventsCausingServices': {
    resetInjiProps: 'UPDATE_CREDENTIAL_REGISTRY';
  };
  'matchesStates':
    | 'idle'
    | 'init'
    | 'injiToutGuide'
    | 'resetInjiProps'
    | 'showInjiTourGuide'
    | 'storingDefaults';
  'tags': never;
}
