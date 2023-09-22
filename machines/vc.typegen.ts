// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    addVcToInProgressDownloads: 'ADD_VC_TO_IN_PROGRESS_DOWNLOADS';
    getReceivedVcsResponse: 'GET_RECEIVED_VCS';
    getVcItemResponse: 'GET_VC_ITEM';
    loadMyVcs: 'REFRESH_MY_VCS' | 'xstate.init';
    loadReceivedVcs: 'REFRESH_RECEIVED_VCS' | 'STORE_RESPONSE';
    moveExistingVcToTop: 'VC_RECEIVED';
    prependToMyVcs: 'VC_ADDED';
    prependToReceivedVcs: 'VC_RECEIVED';
    removeVcFromInProgressDownlods: 'REMOVE_VC_FROM_IN_PROGRESS_DOWNLOADS';
    removeVcFromMyVcs: 'REMOVE_VC_FROM_CONTEXT';
    resetAreAllVcsDownloaded: 'RESET_ARE_ALL_VCS_DOWNLOADED';
    setDownloadedVc: 'VC_DOWNLOADED';
    setMyVcs: 'STORE_RESPONSE';
    setReceivedVcs: 'STORE_RESPONSE';
    setUpdatedVcMetadatas: 'VC_METADATA_UPDATED';
    setVcUpdate: 'VC_UPDATE';
    updateMyVcs: 'VC_METADATA_UPDATED';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasExistingReceivedVc: 'VC_RECEIVED';
  };
  eventsCausingServices: {};
  matchesStates:
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
  tags: never;
}
