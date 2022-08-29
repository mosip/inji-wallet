// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'xstate.stop': { type: 'xstate.stop' };
    'xstate.after(CLEAR_DELAY)#clearingConnection': {
      type: 'xstate.after(CLEAR_DELAY)#clearingConnection';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    checkConnection: 'done.invoke.scan:invocation[0]';
    checkAirplaneMode: 'done.invoke.scan.checkingAirplaneMode.checkingStatus:invocation[0]';
    checkLocationStatus: 'done.invoke.checkingLocationService:invocation[0]';
    checkLocationPermission: 'done.invoke.scan.checkingLocationService.checkingPermission:invocation[0]';
    discoverDevice: 'done.invoke.scan.connecting:invocation[0]';
    exchangeDeviceInfo: 'done.invoke.scan.exchangingDeviceInfo:invocation[0]';
    sendVc: 'done.invoke.scan.reviewing.sendingVc:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  'eventsCausingActions': {
    disconnect:
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.stop'
      | 'CANCEL'
      | 'DISMISS'
      | 'DISCONNECT'
      | 'LOCATION_ENABLED';
    clearReason:
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.stop'
      | 'CANCEL'
      | 'DISMISS'
      | 'DISCONNECT';
    openSettings: 'LOCATION_REQUEST';
    setConnectionParams: 'SCAN';
    setSenderInfo: 'RECEIVE_DEVICE_INFO';
    setReceiverInfo: 'EXCHANGE_DONE';
    setReason: 'UPDATE_REASON';
    setSelectedVc: 'SELECT_VC';
    removeLoggers:
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.init'
      | 'xstate.after(CLEAR_DELAY)#clearingConnection'
      | 'CANCEL'
      | 'DISMISS'
      | 'DISCONNECT';
    requestToDisableFlightMode: 'FLIGHT_REQUEST';
    requestToEnableLocation: 'LOCATION_DISABLED' | 'LOCATION_REQUEST';
    registerLoggers:
      | 'xstate.after(CLEAR_DELAY)#clearingConnection'
      | 'CANCEL'
      | 'DISMISS'
      | 'DISCONNECT';
    requestSenderInfo: 'SCAN';
    logShared: 'VC_ACCEPTED';
  };
  'eventsCausingServices': {
    checkAirplaneMode: 'SCREEN_FOCUS' | 'APP_ACTIVE' | 'FLIGHT_ENABLED';
    checkLocationStatus: 'FLIGHT_DISABLED';
    discoverDevice: 'RECEIVE_DEVICE_INFO';
    exchangeDeviceInfo: 'CONNECTED';
    sendVc: 'SELECT_VC';
  };
  'eventsCausingGuards': {
    isQrValid: 'SCAN';
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
