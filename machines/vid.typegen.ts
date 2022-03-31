// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'eventsCausingActions': {
    setMyVids: 'STORE_RESPONSE';
    setReceivedVids: 'STORE_RESPONSE';
    getReceivedVidsResponse: 'GET_RECEIVED_VIDS';
    getVidItemResponse: 'GET_VID_ITEM';
    prependToMyVids: 'VID_ADDED';
    setDownloadedVid: 'VID_DOWNLOADED';
    prependToReceivedVids: 'VID_RECEIVED';
    loadMyVids: 'REFRESH_MY_VIDS';
    loadReceivedVids: 'STORE_RESPONSE' | 'REFRESH_RECEIVED_VIDS';
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
    | 'init.myVids'
    | 'init.receivedVids'
    | 'ready'
    | 'ready.myVids'
    | 'ready.myVids.idle'
    | 'ready.myVids.refreshing'
    | 'ready.receivedVids'
    | 'ready.receivedVids.idle'
    | 'ready.receivedVids.refreshing'
    | {
        init?: 'myVids' | 'receivedVids';
        ready?:
          | 'myVids'
          | 'receivedVids'
          | {
              myVids?: 'idle' | 'refreshing';
              receivedVids?: 'idle' | 'refreshing';
            };
      };
  'tags': never;
}
