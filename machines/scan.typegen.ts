// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'eventsCausingActions': {
    openSettings: 'LOCATION_REQUEST';
    setConnectionParams: 'SCAN';
    setSenderInfo: 'RECEIVE_DEVICE_INFO';
    setReceiverInfo: 'EXCHANGE_DONE';
    setReason: 'UPDATE_REASON';
    setSelectedVc: 'SELECT_VC';
    removeLoggers:
      | 'SCREEN_BLUR'
      | 'xstate.after(CLEAR_DELAY)#clearingConnection'
      | 'CANCEL'
      | 'DISMISS';
    requestToDisableFlightMode: 'FLIGHT_REQUEST';
    requestToEnableLocation: 'LOCATION_DISABLED' | 'LOCATION_REQUEST';
    disconnect: 'LOCATION_ENABLED';
    registerLoggers:
      | 'xstate.after(CLEAR_DELAY)#clearingConnection'
      | 'CANCEL'
      | 'DISMISS';
    requestSenderInfo: 'SCAN';
    clearReason: 'xstate.init';
    logShared: 'VC_ACCEPTED';
  };
  'internalEvents': {
    'xstate.after(CLEAR_DELAY)#clearingConnection': {
      type: 'xstate.after(CLEAR_DELAY)#clearingConnection';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    checkAirplaneMode: 'done.invoke.checkingAirplaneMode:invocation[0]';
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
  'eventsCausingServices': {
    checkAirplaneMode: 'SCREEN_FOCUS' | 'FLIGHT_DISABLED' | 'FLIGHT_ENABLED';
    checkLocationStatus: 'FLIGHT_DISABLED';
    checkLocationPermission: 'LOCATION_ENABLED' | 'APP_ACTIVE';
    discoverDevice: 'RECEIVE_DEVICE_INFO';
    exchangeDeviceInfo: 'CONNECTED';
    sendVc: 'SELECT_VC';
  };
  'eventsCausingGuards': {
    isQrValid: 'SCAN';
  };
  'eventsCausingDelays': {
    CLEAR_DELAY: 'xstate.init';
  };
  'matchesStates':
    | 'inactive'
    | 'checkingAirplaneMode'
    | 'checkingAirplaneMode.checkingStatus'
    | 'checkingAirplaneMode.requestingToDisable'
    | 'checkingAirplaneMode.enabled'
    | 'checkingLocationService'
    | 'checkingLocationService.checkingStatus'
    | 'checkingLocationService.requestingToEnable'
    | 'checkingLocationService.checkingPermission'
    | 'checkingLocationService.denied'
    | 'checkingLocationService.disabled'
    | 'clearingConnection'
    | 'findingConnection'
    | 'preparingToConnect'
    | 'connecting'
    | 'exchangingDeviceInfo'
    | 'reviewing'
    | 'reviewing.idle'
    | 'reviewing.selectingVc'
    | 'reviewing.sendingVc'
    | 'reviewing.accepted'
    | 'reviewing.rejected'
    | 'reviewing.cancelled'
    | 'reviewing.navigatingToHome'
    | 'disconnected'
    | 'invalid'
    | {
        checkingAirplaneMode?:
          | 'checkingStatus'
          | 'requestingToDisable'
          | 'enabled';
        checkingLocationService?:
          | 'checkingStatus'
          | 'requestingToEnable'
          | 'checkingPermission'
          | 'denied'
          | 'disabled';
        reviewing?:
          | 'idle'
          | 'selectingVc'
          | 'sendingVc'
          | 'accepted'
          | 'rejected'
          | 'cancelled'
          | 'navigatingToHome';
      };
  'tags': never;
}
