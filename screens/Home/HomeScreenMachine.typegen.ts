// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'xstate.after(100)#HomeScreen.tabs.init': {
      type: 'xstate.after(100)#HomeScreen.tabs.init';
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    resetSelectedVc: 'DISMISS_MODAL' | 'xstate.init';
    sendAddEvent: 'DOWNLOAD_ID';
    setSelectedVc: 'VIEW_VC';
    spawnTabActors: 'xstate.init';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    issuersMachine: 'GOTO_ISSUERS';
  };
  matchesStates:
    | 'modals'
    | 'modals.none'
    | 'modals.viewingVc'
    | 'tabs'
    | 'tabs.gotoIssuers'
    | 'tabs.history'
    | 'tabs.idle'
    | 'tabs.init'
    | 'tabs.myVcs'
    | 'tabs.receivedVcs'
    | {
        modals?: 'none' | 'viewingVc';
        tabs?:
          | 'gotoIssuers'
          | 'history'
          | 'idle'
          | 'init'
          | 'myVcs'
          | 'receivedVcs';
      };
  tags: never;
}
