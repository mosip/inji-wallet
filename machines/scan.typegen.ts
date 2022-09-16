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
    checkAirplaneMode: 'done.invoke.scan.checkingAirplaneMode.checkingStatus:invocation[0]';
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
    requestToDisableFlightMode: 'FLIGHT_REQUEST';
    requestToEnableLocation: 'LOCATION_DISABLED' | 'LOCATION_REQUEST';
    setConnectionParams: 'SCAN';
    setReason: 'UPDATE_REASON';
    setReceiverInfo: 'EXCHANGE_DONE';
    setScannedQrParams: 'SCAN';
    setSelectedVc: 'SELECT_VC';
    setSenderInfo: 'RECEIVE_DEVICE_INFO';
  };
  'eventsCausingServices': {
    checkAirplaneMode: 'APP_ACTIVE' | 'FLIGHT_ENABLED' | 'SCREEN_FOCUS';
    checkLocationPermission: 'APP_ACTIVE' | 'LOCATION_ENABLED';
    checkLocationStatus: 'FLIGHT_DISABLED';
    discoverDevice: 'RECEIVE_DEVICE_INFO';
    exchangeDeviceInfo: 'CONNECTED';
    monitorConnection: 'SCREEN_BLUR' | 'SCREEN_FOCUS' | 'xstate.init';
    sendVc: 'SELECT_VC';
  };
  'eventsCausingGuards': {
    isQrOffline: 'SCAN';
    isQrOnline: 'SCAN';
  };
  'eventsCausingDelays': {
    CLEAR_DELAY: 'LOCATION_ENABLED';
  };
  'matchesStates':
    | 'checkingAirplaneMode'
    | 'checkingAirplaneMode.checkingStatus'
    | 'checkingAirplaneMode.enabled'
    | 'checkingAirplaneMode.requestingToDisable'
    | 'checkingLocationService'
    | 'checkingLocationService.checkingPermission'
    | 'checkingLocationService.checkingStatus'
    | 'checkingLocationService.denied'
    | 'checkingLocationService.disabled'
    | 'checkingLocationService.requestingToEnable'
    | 'clearingConnection'
    | 'connecting'
    | 'disconnected'
    | 'exchangingDeviceInfo'
    | 'findingConnection'
    | 'inactive'
    | 'invalid'
    | 'preparingToConnect'
    | 'reviewing'
    | 'reviewing.accepted'
    | 'reviewing.cancelled'
    | 'reviewing.idle'
    | 'reviewing.navigatingToHome'
    | 'reviewing.rejected'
    | 'reviewing.selectingVc'
    | 'reviewing.sendingVc'
    | {
        checkingAirplaneMode?:
          | 'checkingStatus'
          | 'enabled'
          | 'requestingToDisable';
        checkingLocationService?:
          | 'checkingPermission'
          | 'checkingStatus'
          | 'denied'
          | 'disabled'
          | 'requestingToEnable';
        reviewing?:
          | 'accepted'
          | 'cancelled'
          | 'idle'
          | 'navigatingToHome'
          | 'rejected'
          | 'selectingVc'
          | 'sendingVc';
      };
  'tags': never;
}
