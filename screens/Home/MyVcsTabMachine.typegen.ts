// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke.AddVcModal': {
      type: 'done.invoke.AddVcModal';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
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
    completeOnboarding: 'ADD_VC' | 'ONBOARDING_DONE';
    getOnboardingStatus: 'xstate.init';
    sendVcAdded: 'STORE_RESPONSE';
    storeVcItem: 'done.invoke.AddVcModal';
    viewVcFromParent: 'VIEW_VC';
  };
  'eventsCausingServices': {};
  'eventsCausingGuards': {
    isOnboardingDone: 'STORE_RESPONSE';
  };
  'eventsCausingDelays': {};
  'matchesStates':
    | 'addingVc'
    | 'addingVc.addVcSuccessful'
    | 'addingVc.storing'
    | 'addingVc.waitingForvcKey'
    | 'checkingOnboardingStatus'
    | 'idle'
    | 'onboarding'
    | 'viewingVc'
    | { addingVc?: 'addVcSuccessful' | 'storing' | 'waitingForvcKey' };
  'tags': never;
}
