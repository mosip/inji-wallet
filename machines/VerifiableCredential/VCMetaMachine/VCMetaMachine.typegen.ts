// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.vcMeta.ready.tamperedVCs.triggerAutoBackupForTamperedVcDeletion:invocation[0]': {
      type: 'done.invoke.vcMeta.ready.tamperedVCs.triggerAutoBackupForTamperedVcDeletion:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    isUserSignedAlready: 'done.invoke.vcMeta.ready.tamperedVCs.triggerAutoBackupForTamperedVcDeletion:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    addVcToInProgressDownloads: 'ADD_VC_TO_IN_PROGRESS_DOWNLOADS';
    getVcItemResponse: 'GET_VC_ITEM';
    loadMyVcs: 'STORE_RESPONSE';
    loadMyVcsMetadata:
      | 'DOWNLOAD_LIMIT_EXPIRED'
      | 'REFRESH_MY_VCS'
      | 'REFRESH_RECEIVED_VCS'
      | 'STORE_RESPONSE'
      | 'VERIFY_VC_FAILED'
      | 'xstate.init';
    loadReceivedVcs: 'STORE_RESPONSE';
    loadReceivedVcsMetadata: 'REFRESH_RECEIVED_VCS' | 'STORE_RESPONSE';
    logTamperedVCsremoved: 'done.invoke.vcMeta.ready.tamperedVCs.triggerAutoBackupForTamperedVcDeletion:invocation[0]';
    prependToMyVcsMetadata: 'VC_ADDED';
    removeDownloadFailedVcsFromStorage: 'DELETE_VC';
    removeDownloadingFailedVcsFromMyVcs: 'STORE_RESPONSE';
    removeVcFromInProgressDownlods:
      | 'DOWNLOAD_LIMIT_EXPIRED'
      | 'REMOVE_VC_FROM_IN_PROGRESS_DOWNLOADS'
      | 'VERIFY_VC_FAILED';
    removeVcFromMyVcsMetadata: 'REMOVE_VC_FROM_CONTEXT';
    resetDownloadFailedVcs: 'STORE_RESPONSE';
    resetInProgressVcsDownloaded: 'RESET_IN_PROGRESS_VCS_DOWNLOADED';
    resetTamperedVcs: 'REMOVE_TAMPERED_VCS';
    resetVerificationErrorMessage: 'RESET_VERIFY_ERROR';
    resetWalletBindingSuccess: 'RESET_WALLET_BINDING_SUCCESS';
    sendBackupEvent: 'done.invoke.vcMeta.ready.tamperedVCs.triggerAutoBackupForTamperedVcDeletion:invocation[0]';
    setDownloadedVc: 'VC_DOWNLOADED';
    setDownloadingFailedVcs: 'DOWNLOAD_LIMIT_EXPIRED';
    setMyVcs: 'STORE_RESPONSE';
    setMyVcsMetadata: 'STORE_RESPONSE';
    setReceivedVcs: 'STORE_RESPONSE';
    setReceivedVcsMetadata: 'STORE_RESPONSE';
    setUpdatedVcMetadatas: 'VC_METADATA_UPDATED';
    setVerificationErrorMessage: 'VERIFY_VC_FAILED';
    setWalletBindingSuccess: 'WALLET_BINDING_SUCCESS';
    updateMyVcsMetadata: 'VC_METADATA_UPDATED';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isAnyVcTampered: 'SHOW_TAMPERED_POPUP';
    isSignedIn: 'done.invoke.vcMeta.ready.tamperedVCs.triggerAutoBackupForTamperedVcDeletion:invocation[0]';
  };
  eventsCausingServices: {
    isUserSignedAlready: 'REMOVE_TAMPERED_VCS';
  };
  matchesStates:
    | 'deletingFailedVcs'
    | 'ready'
    | 'ready.myVcsData'
    | 'ready.myVcsMetadata'
    | 'ready.receivedVcs'
    | 'ready.receivedVcsMetadata'
    | 'ready.showTamperedPopup'
    | 'ready.tamperedVCs'
    | 'ready.tamperedVCs.idle'
    | 'ready.tamperedVCs.triggerAutoBackupForTamperedVcDeletion'
    | {
        ready?:
          | 'myVcsData'
          | 'myVcsMetadata'
          | 'receivedVcs'
          | 'receivedVcsMetadata'
          | 'showTamperedPopup'
          | 'tamperedVCs'
          | {tamperedVCs?: 'idle' | 'triggerAutoBackupForTamperedVcDeletion'};
      };
  tags: never;
}
