// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'eventsCausingActions': {
    completeOnboarding: 'ADD_VC' | 'ONBOARDING_DONE';
    sendVcAdded: 'STORE_RESPONSE';
    getOnboardingStatus: 'xstate.init';
    viewVcFromParent: 'VIEW_VC';
    storeVcItem: 'done.invoke.AddVcModal';
  };
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
  'eventsCausingServices': {};
  'eventsCausingGuards': {
    isOnboardingDone: 'STORE_RESPONSE';
  };
  'eventsCausingDelays': {};
  'matchesStates':
    | 'checkingOnboardingStatus'
    | 'onboarding'
    | 'idle'
    | 'viewingVc'
    | 'addingVc'
    | 'addingVc.waitingForvcKey'
    | 'addingVc.storing'
    | 'addingVc.addVcSuccessful'
    | { addingVc?: 'waitingForvcKey' | 'storing' | 'addVcSuccessful' };
  'tags': never;
}
