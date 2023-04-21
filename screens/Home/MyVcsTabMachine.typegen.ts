// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke.AddVcModal': {
      type: 'done.invoke.AddVcModal';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.GetVcModal': {
      type: 'done.invoke.GetVcModal';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {};
  'missingImplementations': {
    actions: never;
    delays: never;
    guards: never;
    services: 'AddVcModal' | 'GetVcModal';
  };
  'eventsCausingActions': {
    completeOnboarding: 'ADD_VC' | 'ONBOARDING_DONE';
    getOnboardingStatus: 'xstate.init';
    sendVcAdded: 'STORE_RESPONSE';
    storeVcItem: 'done.invoke.AddVcModal';
    viewVcFromParent: 'VIEW_VC';
  };
  'eventsCausingDelays': {};
  'eventsCausingGuards': {
    isOnboardingDone: 'STORE_RESPONSE';
  };
  'eventsCausingServices': {
    AddVcModal: 'ADD_VC' | 'done.invoke.GetVcModal';
    GetVcModal: 'GET_VC';
  };
  'matchesStates':
    | 'addingVc'
    | 'addingVc.addVcSuccessful'
    | 'addingVc.storing'
    | 'addingVc.waitingForvcKey'
    | 'checkingOnboardingStatus'
    | 'gettingVc'
    | 'gettingVc.waitingForvcKey'
    | 'idle'
    | 'onboarding'
    | 'viewingVc'
    | {
        addingVc?: 'addVcSuccessful' | 'storing' | 'waitingForvcKey';
        gettingVc?: 'waitingForvcKey';
      };
  'tags': never;
}
