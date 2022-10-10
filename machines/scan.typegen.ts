// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'xstate.after(CLEAR_DELAY)#clearingConnection': {
      type: 'xstate.after(CLEAR_DELAY)#clearingConnection';
    };
    'xstate.init': { type: 'xstate.init' };
    'xstate.stop': { type: 'xstate.stop' };
  };
  'invokeSrcNameMap': {
    checkLocationPermission: 'done.invoke.scan.checkingLocationService.checkingPermission:invocation[0]';
    checkLocationStatus: 'done.invoke.checkingLocationService:invocation[0]';
    discoverDevice: 'done.invoke.scan.connecting:invocation[0]';
    exchangeDeviceInfo: 'done.invoke.scan.exchangingDeviceInfo:invocation[0]';
    monitorConnection: 'done.invoke.scan:invocation[0]';
    sendVc: 'done.invoke.scan.reviewing.sendingVc:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  'eventsCausingActions': {
    clearReason:
      | 'CANCEL'
      | 'DISCONNECT'
      | 'DISMISS'
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.stop';
    clearScannedQrParams:
      | 'CANCEL'
      | 'DISCONNECT'
      | 'DISMISS'
      | 'xstate.after(CLEAR_DELAY)#clearingConnection';
    disconnect:
      | 'CANCEL'
      | 'DISCONNECT'
      | 'DISMISS'
      | 'LOCATION_ENABLED'
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.stop';
    logShared: 'VC_ACCEPTED';
    openSettings: 'LOCATION_REQUEST';
    registerLoggers:
      | 'CANCEL'
      | 'DISCONNECT'
      | 'DISMISS'
      | 'xstate.after(CLEAR_DELAY)#clearingConnection';
    removeLoggers:
      | 'CANCEL'
      | 'DISCONNECT'
      | 'DISMISS'
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.after(CLEAR_DELAY)#clearingConnection'
      | 'xstate.init';
    requestSenderInfo: 'SCAN';
    requestToEnableLocation: 'LOCATION_DISABLED' | 'LOCATION_REQUEST';
    setConnectionParams: 'SCAN';
    setReason: 'UPDATE_REASON';
    setReceiverInfo: 'EXCHANGE_DONE';
    setScannedQrParams: 'SCAN';
    setSelectedVc: 'SELECT_VC' | 'VERIFY_AND_SELECT_VC';
    setSenderInfo: 'RECEIVE_DEVICE_INFO';
  };
  'eventsCausingServices': {
    checkLocationPermission: 'APP_ACTIVE' | 'LOCATION_ENABLED';
    checkLocationStatus: 'CANCEL' | 'SCREEN_FOCUS';
    discoverDevice: 'RECEIVE_DEVICE_INFO';
    exchangeDeviceInfo: 'CONNECTED';
    monitorConnection: 'SCREEN_BLUR' | 'SCREEN_FOCUS' | 'xstate.init';
    sendVc: 'FACE_VALID' | 'SELECT_VC';
  };
  'eventsCausingGuards': {
    isQrOffline: 'SCAN';
    isQrOnline: 'SCAN';
  };
  'eventsCausingDelays': {
    CLEAR_DELAY: 'LOCATION_ENABLED';
    CONNECTION_TIMEOUT:
      | 'CONNECTED'
      | 'FACE_VALID'
      | 'RECEIVE_DEVICE_INFO'
      | 'SELECT_VC';
  };
  'matchesStates':
    | 'checkingLocationService'
    | 'checkingLocationService.checkingPermission'
    | 'checkingLocationService.checkingStatus'
    | 'checkingLocationService.denied'
    | 'checkingLocationService.disabled'
    | 'checkingLocationService.requestingToEnable'
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
    | 'preparingToConnect'
    | 'reviewing'
    | 'reviewing.accepted'
    | 'reviewing.cancelled'
    | 'reviewing.idle'
    | 'reviewing.invalidUserIdentity'
    | 'reviewing.navigatingToHome'
    | 'reviewing.rejected'
    | 'reviewing.selectingVc'
    | 'reviewing.sendingVc'
    | 'reviewing.sendingVc.inProgress'
    | 'reviewing.sendingVc.timeout'
    | 'reviewing.verifyingUserIdentity'
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
          | 'cancelled'
          | 'idle'
          | 'invalidUserIdentity'
          | 'navigatingToHome'
          | 'rejected'
          | 'selectingVc'
          | 'sendingVc'
          | 'verifyingUserIdentity'
          | { sendingVc?: 'inProgress' | 'timeout' };
      };
  'tags': never;
}
