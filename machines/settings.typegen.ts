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
    setContext: 'STORE_RESPONSE';
    toggleBiometricUnlock: 'TOGGLE_BIOMETRIC_UNLOCK';
    storeContext:
      | 'TOGGLE_BIOMETRIC_UNLOCK'
      | 'UPDATE_NAME'
      | 'UPDATE_VC_LABEL'
      | 'STORE_RESPONSE';
    updateName: 'UPDATE_NAME';
    updateVcLabel: 'UPDATE_VC_LABEL';
    requestStoredContext: 'xstate.init';
  };
  'eventsCausingServices': {};
  'eventsCausingGuards': {
    hasData: 'STORE_RESPONSE';
  };
  'eventsCausingDelays': {};
  'matchesStates': 'init' | 'storingDefaults' | 'idle';
  'tags': never;
}
