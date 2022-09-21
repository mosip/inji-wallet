// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'xstate.after(100)#HomeScreen.tabs.init': {
      type: 'xstate.after(100)#HomeScreen.tabs.init';
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
    setSelectedVc: 'VIEW_VC';
    resetSelectedVc: 'xstate.init' | 'DISMISS_MODAL';
    spawnTabActors: 'xstate.init';
  };
  'eventsCausingServices': {};
  'eventsCausingGuards': {};
  'eventsCausingDelays': {};
  'matchesStates':
    | 'tabs'
    | 'tabs.init'
    | 'tabs.myVcs'
    | 'tabs.receivedVcs'
    | 'tabs.history'
    | 'modals'
    | 'modals.none'
    | 'modals.viewingVc'
    | {
        tabs?: 'init' | 'myVcs' | 'receivedVcs' | 'history';
        modals?: 'none' | 'viewingVc';
      };
  'tags': never;
}
