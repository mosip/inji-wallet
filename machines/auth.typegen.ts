// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'xstate.init': { type: 'xstate.init' };
    '': { type: '' };
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
    setPasscode: 'SETUP_PASSCODE';
    storeContext: 'SETUP_PASSCODE' | 'SETUP_BIOMETRICS' | 'STORE_RESPONSE';
    setBiometrics: 'SETUP_BIOMETRICS';
    requestStoredContext: 'xstate.init';
  };
  'eventsCausingServices': {};
  'eventsCausingGuards': {
    hasData: 'STORE_RESPONSE';
    hasPasscodeSet: '';
    hasBiometricSet: '';
  };
  'eventsCausingDelays': {};
  'matchesStates':
    | 'init'
    | 'savingDefaults'
    | 'checkingAuth'
    | 'settingUp'
    | 'unauthorized'
    | 'authorized';
  'tags': never;
}
