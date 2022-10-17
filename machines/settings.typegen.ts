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
    requestStoredContext: 'xstate.init';
    setContext: 'STORE_RESPONSE';
    storeContext:
      | 'STORE_RESPONSE'
      | 'TOGGLE_BIOMETRIC_UNLOCK'
      | 'UPDATE_NAME'
      | 'UPDATE_VC_LABEL';
    toggleBiometricUnlock: 'TOGGLE_BIOMETRIC_UNLOCK';
    updateName: 'UPDATE_NAME';
    updateVcLabel: 'UPDATE_VC_LABEL';
  };
  'eventsCausingServices': {};
  'eventsCausingGuards': {
    hasData: 'STORE_RESPONSE';
  };
  'eventsCausingDelays': {};
  'matchesStates': 'idle' | 'init' | 'storingDefaults';
  'tags': never;
}
