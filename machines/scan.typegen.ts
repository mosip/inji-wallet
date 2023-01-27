// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke.scan.reviewing.creatingVp:invocation[0]': {
      type: 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.scan.reviewing.creatingVp:invocation[0]': {
      type: 'error.platform.scan.reviewing.creatingVp:invocation[0]';
      data: unknown;
    };
    'xstate.after(CANCEL_TIMEOUT)#scan.reviewing.cancelling': {
      type: 'xstate.after(CANCEL_TIMEOUT)#scan.reviewing.cancelling';
    };
    'xstate.after(CLEAR_DELAY)#scan.clearingConnection': {
      type: 'xstate.after(CLEAR_DELAY)#scan.clearingConnection';
    };
    'xstate.after(CONNECTION_TIMEOUT)#scan.connecting.inProgress': {
      type: 'xstate.after(CONNECTION_TIMEOUT)#scan.connecting.inProgress';
    };
    'xstate.after(CONNECTION_TIMEOUT)#scan.exchangingDeviceInfo': {
      type: 'xstate.after(CONNECTION_TIMEOUT)#scan.exchangingDeviceInfo';
    };
    'xstate.after(SHARING_TIMEOUT)#scan.reviewing.sendingVc.inProgress': {
      type: 'xstate.after(SHARING_TIMEOUT)#scan.reviewing.sendingVc.inProgress';
    };
    'xstate.init': { type: 'xstate.init' };
    'xstate.stop': { type: 'xstate.stop' };
  };
  'invokeSrcNameMap': {
    checkLocationPermission: 'done.invoke.scan.checkingLocationService.checkingPermission:invocation[0]';
    checkLocationStatus: 'done.invoke.scan.checkingLocationService.checkingStatus:invocation[0]';
    checkNetwork: 'done.invoke.scan.checkingNetwork:invocation[0]';
    createVp: 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
    discoverDevice: 'done.invoke.scan.connecting:invocation[0]';
    exchangeDeviceInfo: 'done.invoke.scan.exchangingDeviceInfo:invocation[0]';
    monitorCancellation: 'done.invoke.scan.reviewing.selectingVc:invocation[0]';
    monitorConnection: 'done.invoke.scan:invocation[0]';
    sendDisconnect: 'done.invoke.scan.reviewing.cancelling:invocation[0]';
    sendVc: 'done.invoke.scan.reviewing.sendingVc:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    clearCreatedVp:
      | 'DISCONNECT'
      | 'DISMISS'
      | 'OFFLINE'
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.after(CANCEL_TIMEOUT)#scan.reviewing.cancelling'
      | 'xstate.stop';
    clearReason:
      | 'DISCONNECT'
      | 'DISMISS'
      | 'OFFLINE'
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.after(CANCEL_TIMEOUT)#scan.reviewing.cancelling'
      | 'xstate.stop';
    clearScannedQrParams:
      | 'DISCONNECT'
      | 'DISMISS'
      | 'xstate.after(CANCEL_TIMEOUT)#scan.reviewing.cancelling'
      | 'xstate.after(CLEAR_DELAY)#scan.clearingConnection';
    disconnect:
      | 'DISCONNECT'
      | 'DISMISS'
      | 'LOCATION_ENABLED'
      | 'OFFLINE'
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.after(CANCEL_TIMEOUT)#scan.reviewing.cancelling'
      | 'xstate.stop';
    logFailedVerification: 'FACE_INVALID';
    logShared: 'VC_ACCEPTED';
    onlineUnsubscribe:
      | 'ACCEPT_REQUEST'
      | 'CANCEL'
      | 'DISCONNECT'
      | 'OFFLINE'
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'VERIFY_AND_ACCEPT_REQUEST'
      | 'xstate.stop';
    openSettings: 'LOCATION_REQUEST';
    registerLoggers:
      | 'DISCONNECT'
      | 'DISMISS'
      | 'xstate.after(CANCEL_TIMEOUT)#scan.reviewing.cancelling'
      | 'xstate.after(CLEAR_DELAY)#scan.clearingConnection';
    removeLoggers:
      | 'DISCONNECT'
      | 'DISMISS'
      | 'SCREEN_BLUR'
      | 'xstate.after(CANCEL_TIMEOUT)#scan.reviewing.cancelling'
      | 'xstate.after(CLEAR_DELAY)#scan.clearingConnection'
      | 'xstate.init';
    requestSenderInfo: 'ONLINE' | 'SCAN';
    requestToEnableLocation: 'LOCATION_DISABLED' | 'LOCATION_REQUEST';
    resetShouldVerifyPresence: 'CONNECTED' | 'EXCHANGE_DONE';
    setConnectionParams: 'SCAN';
    setCreatedVp: 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
    setReason: 'UPDATE_REASON';
    setReceiverInfo: 'EXCHANGE_DONE';
    setScannedQrParams: 'SCAN';
    setSelectedVc: 'SELECT_VC';
    setSenderInfo: 'RECEIVE_DEVICE_INFO';
    setShareLogTypeUnverified: 'ACCEPT_REQUEST';
    setShareLogTypeVerified: 'FACE_VALID';
    toggleShouldVerifyPresence: 'TOGGLE_USER_CONSENT';
  };
  'eventsCausingDelays': {
    CANCEL_TIMEOUT: 'CANCEL';
    CLEAR_DELAY: 'LOCATION_ENABLED';
    CONNECTION_TIMEOUT:
      | 'CONNECTED'
      | 'RECEIVE_DEVICE_INFO'
      | 'xstate.after(CONNECTION_TIMEOUT)#scan.exchangingDeviceInfo';
    SHARING_TIMEOUT:
      | 'ACCEPT_REQUEST'
      | 'FACE_VALID'
      | 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
  };
  'eventsCausingGuards': {
    isModeOnline: 'CONNECTED' | 'OFFLINE';
    isQrOffline: 'SCAN';
    isQrOnline: 'SCAN';
  };
  'eventsCausingServices': {
    checkLocationPermission: 'APP_ACTIVE' | 'LOCATION_ENABLED';
    checkLocationStatus: 'SCREEN_FOCUS';
    checkNetwork: 'SCAN';
    createVp: never;
    discoverDevice: 'RECEIVE_DEVICE_INFO';
    exchangeDeviceInfo:
      | 'CONNECTED'
      | 'xstate.after(CONNECTION_TIMEOUT)#scan.exchangingDeviceInfo';
    monitorCancellation:
      | 'CANCEL'
      | 'CONNECTED'
      | 'DISMISS'
      | 'EXCHANGE_DONE'
      | 'error.platform.scan.reviewing.creatingVp:invocation[0]';
    monitorConnection: 'xstate.init';
    sendDisconnect: 'CANCEL';
    sendVc:
      | 'ACCEPT_REQUEST'
      | 'FACE_VALID'
      | 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
  };
  'matchesStates':
    | 'checkingLocationService'
    | 'checkingLocationService.checkingPermission'
    | 'checkingLocationService.checkingStatus'
    | 'checkingLocationService.denied'
    | 'checkingLocationService.disabled'
    | 'checkingLocationService.requestingToEnable'
    | 'checkingNetwork'
    | 'clearingConnection'
    | 'connecting'
    | 'connecting.inProgress'
    | 'connecting.timeout'
    | 'disconnected'
    | 'exchangingDeviceInfo'
    | 'exchangingDeviceInfo.inProgress'
    | 'exchangingDeviceInfo.timeout'
    | 'findingConnection'
    | 'inactive'
    | 'invalid'
    | 'offline'
    | 'preparingToConnect'
    | 'reviewing'
    | 'reviewing.accepted'
    | 'reviewing.cancelling'
    | 'reviewing.creatingVp'
    | 'reviewing.invalidIdentity'
    | 'reviewing.navigatingToHome'
    | 'reviewing.rejected'
    | 'reviewing.selectingVc'
    | 'reviewing.sendingVc'
    | 'reviewing.sendingVc.inProgress'
    | 'reviewing.sendingVc.sent'
    | 'reviewing.sendingVc.timeout'
    | 'reviewing.verifyingIdentity'
    | {
        checkingLocationService?:
          | 'checkingPermission'
          | 'checkingStatus'
          | 'denied'
          | 'disabled'
          | 'requestingToEnable';
        connecting?: 'inProgress' | 'timeout';
        exchangingDeviceInfo?: 'inProgress' | 'timeout';
        reviewing?:
          | 'accepted'
          | 'cancelling'
          | 'creatingVp'
          | 'invalidIdentity'
          | 'navigatingToHome'
          | 'rejected'
          | 'selectingVc'
          | 'sendingVc'
          | 'verifyingIdentity'
          | { sendingVc?: 'inProgress' | 'sent' | 'timeout' };
      };
  'tags': never;
}
