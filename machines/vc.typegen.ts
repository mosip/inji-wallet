// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'eventsCausingActions': {
    setMyVcs: 'STORE_RESPONSE';
    setReceivedVcs: 'STORE_RESPONSE';
    getReceivedVcsResponse: 'GET_RECEIVED_VCS';
    getVcItemResponse: 'GET_VC_ITEM';
    prependToMyVcs: 'VC_ADDED';
    setDownloadedVc: 'VC_DOWNLOADED';
    prependToReceivedVcs: 'VC_RECEIVED';
    loadMyVcs: 'REFRESH_MY_VCS';
    loadReceivedVcs: 'STORE_RESPONSE' | 'REFRESH_RECEIVED_VCS';
  };
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
  'eventsCausingServices': {};
  'eventsCausingGuards': {};
  'eventsCausingDelays': {};
  'matchesStates':
    | 'init'
    | 'init.myVcs'
    | 'init.receivedVcs'
    | 'ready'
    | 'ready.myVcs'
    | 'ready.myVcs.idle'
    | 'ready.myVcs.refreshing'
    | 'ready.receivedVcs'
    | 'ready.receivedVcs.idle'
    | 'ready.receivedVcs.refreshing'
    | {
        init?: 'myVcs' | 'receivedVcs';
        ready?:
          | 'myVcs'
          | 'receivedVcs'
          | {
              myVcs?: 'idle' | 'refreshing';
              receivedVcs?: 'idle' | 'refreshing';
            };
      };
  'tags': never;
}
