// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
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
    addVcToInProgressDownloads: 'ADD_VC_TO_IN_PROGRESS_DOWNLOADS';
    getReceivedVcsResponse: 'GET_RECEIVED_VCS';
    getVcItemResponse: 'GET_VC_ITEM';
    loadMyVcs:
      | 'DOWNLOAD_LIMIT_EXPIRED'
      | 'REFRESH_MY_VCS'
      | 'REMOVE_TAMPERED_VCS'
      | 'STORE_RESPONSE'
      | 'VERIFY_VC_FAILED'
      | 'xstate.init';
    loadReceivedVcs: 'REFRESH_RECEIVED_VCS' | 'STORE_RESPONSE';
    logTamperedVCsremoved: 'REMOVE_TAMPERED_VCS';
    moveExistingVcToTop: 'VC_RECEIVED';
    prependToMyVcs: 'VC_ADDED';
    prependToReceivedVcs: 'VC_RECEIVED';
    removeDownloadFailedVcsFromStorage: 'DELETE_VC';
    removeDownloadingFailedVcsFromMyVcs: 'STORE_RESPONSE';
    removeTamperedVcs: 'REMOVE_TAMPERED_VCS';
    removeVcFromInProgressDownlods:
      | 'DOWNLOAD_LIMIT_EXPIRED'
      | 'REMOVE_VC_FROM_IN_PROGRESS_DOWNLOADS'
      | 'VERIFY_VC_FAILED';
    removeVcFromMyVcs: 'REMOVE_VC_FROM_CONTEXT';
    resetAreAllVcsDownloaded: 'RESET_ARE_ALL_VCS_DOWNLOADED';
    resetDownloadFailedVcs: 'STORE_RESPONSE';
    resetVerificationErrorMessage: 'RESET_VERIFY_ERROR';
    resetWalletBindingSuccess: 'RESET_WALLET_BINDING_SUCCESS';
    setDownloadedVCFromOpenId4VCI: 'VC_DOWNLOADED_FROM_OPENID4VCI';
    setDownloadedVc: 'VC_DOWNLOADED';
    setDownloadingFailedVcs: 'DOWNLOAD_LIMIT_EXPIRED';
    setMyVcs: 'STORE_RESPONSE';
    setReceivedVcs: 'STORE_RESPONSE';
    setTamperedVcs: 'TAMPERED_VC';
    setUpdatedVcMetadatas: 'VC_METADATA_UPDATED';
    setVcUpdate: 'VC_UPDATE';
    setVerificationErrorMessage: 'VERIFY_VC_FAILED';
    setWalletBindingSuccess: 'WALLET_BINDING_SUCCESS';
    updateMyVcs: 'VC_METADATA_UPDATED';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasExistingReceivedVc: 'VC_RECEIVED';
  };
  eventsCausingServices: {};
  matchesStates:
    | 'deletingFailedVcs'
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
    | 'tamperedVCs'
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
