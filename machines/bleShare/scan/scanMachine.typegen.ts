// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    '': { type: '' };
    'done.invoke.QrLogin': {
      type: 'done.invoke.QrLogin';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.scan.reviewing.creatingVp:invocation[0]': {
      type: 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.after(CONNECTION_TIMEOUT)#scan.connecting.inProgress': {
      type: 'xstate.after(CONNECTION_TIMEOUT)#scan.connecting.inProgress';
    };
    'xstate.after(DESTROY_TIMEOUT)#scan.clearingConnection': {
      type: 'xstate.after(DESTROY_TIMEOUT)#scan.clearingConnection';
    };
    'xstate.after(SHARING_TIMEOUT)#scan.reviewing.sendingVc.inProgress': {
      type: 'xstate.after(SHARING_TIMEOUT)#scan.reviewing.sendingVc.inProgress';
    };
    'xstate.init': { type: 'xstate.init' };
    'xstate.stop': { type: 'xstate.stop' };
  };
  'invokeSrcNameMap': {
    checkBluetoothPermission: 'done.invoke.scan.checkBluetoothPermission.checking:invocation[0]';
    checkBluetoothState:
      | 'done.invoke.scan.checkBluetoothState.checking:invocation[0]'
      | 'done.invoke.scan.recheckBluetoothState.checking:invocation[0]';
    checkLocationPermission: 'done.invoke.scan.checkingLocationService.checkingPermission:invocation[0]';
    checkLocationStatus: 'done.invoke.scan.checkingLocationService.checkingStatus:invocation[0]';
    checkNearByDevicesPermission: 'done.invoke.scan.checkNearbyDevicesPermission.checking:invocation[0]';
    createVp: 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
    disconnect: 'done.invoke.scan.clearingConnection:invocation[0]';
    monitorConnection: 'done.invoke.scan:invocation[0]';
    requestBluetooth: 'done.invoke.scan.checkBluetoothState.requesting:invocation[0]';
    requestNearByDevicesPermission: 'done.invoke.scan.checkNearbyDevicesPermission.requesting:invocation[0]';
    sendVc: 'done.invoke.scan.reviewing.sendingVc:invocation[0]';
    startConnection: 'done.invoke.scan.connecting:invocation[0]';
  };
  'missingImplementations': {
    actions: 'setBleError';
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    clearCreatedVp:
      | ''
      | 'BLE_ERROR'
      | 'DISCONNECT'
      | 'DISMISS'
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.stop';
    clearReason:
      | ''
      | 'BLE_ERROR'
      | 'DISCONNECT'
      | 'DISMISS'
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.stop';
    clearUri:
      | 'DISCONNECT'
      | 'DISMISS'
      | 'xstate.after(DESTROY_TIMEOUT)#scan.clearingConnection';
    logFailedVerification: 'FACE_INVALID';
    logShared: 'VC_ACCEPTED';
    openAppPermission: 'GOTO_SETTINGS';
    openBluetoothSettings: 'GOTO_SETTINGS';
    openSettings: 'LOCATION_REQUEST';
    registerLoggers:
      | 'DISCONNECT'
      | 'DISMISS'
      | 'xstate.after(DESTROY_TIMEOUT)#scan.clearingConnection';
    removeLoggers:
      | 'DISCONNECT'
      | 'DISMISS'
      | 'SCREEN_BLUR'
      | 'xstate.after(DESTROY_TIMEOUT)#scan.clearingConnection'
      | 'xstate.init';
    requestToEnableLocation: 'LOCATION_DISABLED' | 'LOCATION_REQUEST';
    resetShouldVerifyPresence: 'CANCEL' | 'CONNECTED';
    sendScanData: 'SCAN';
    setBleError: 'BLE_ERROR';
    setChildRef:
      | 'DISCONNECT'
      | 'DISMISS'
      | 'xstate.after(DESTROY_TIMEOUT)#scan.clearingConnection';
    setCreatedVp: 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
    setLinkCode: 'SCAN';
    setReadyForBluetoothStateCheck: 'BLUETOOTH_PERMISSION_ENABLED';
    setReason: 'UPDATE_REASON';
    setReceiverInfo: 'CONNECTED';
    setSelectedVc: 'SELECT_VC';
    setSenderInfo: 'CONNECTED';
    setShareLogTypeUnverified: 'ACCEPT_REQUEST';
    setShareLogTypeVerified: 'FACE_VALID';
    setUri: 'SCAN';
    storeLoginItem: 'done.invoke.QrLogin';
    storingActivityLog: 'STORE_RESPONSE';
    toggleShouldVerifyPresence: 'TOGGLE_USER_CONSENT';
  };
  'eventsCausingDelays': {
    CONNECTION_TIMEOUT: 'SCAN';
    DESTROY_TIMEOUT: '' | 'DISMISS' | 'LOCATION_ENABLED';
    SHARING_TIMEOUT:
      | 'ACCEPT_REQUEST'
      | 'FACE_VALID'
      | 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
  };
  'eventsCausingGuards': {
    isIOS: 'BLUETOOTH_STATE_DISABLED' | 'START_PERMISSION_CHECK';
    isOpenIdQr: 'SCAN';
    isQrLogin: 'SCAN';
    uptoAndroid11: '' | 'START_PERMISSION_CHECK';
  };
  'eventsCausingServices': {
    QrLogin: 'SCAN';
    checkBluetoothPermission:
      | ''
      | 'BLUETOOTH_STATE_DISABLED'
      | 'NEARBY_ENABLED'
      | 'START_PERMISSION_CHECK';
    checkBluetoothState: '' | 'APP_ACTIVE';
    checkLocationPermission: 'APP_ACTIVE' | 'LOCATION_ENABLED';
    checkLocationStatus: '';
    checkNearByDevicesPermission: 'APP_ACTIVE' | 'START_PERMISSION_CHECK';
    createVp: never;
    disconnect: '' | 'DISMISS' | 'LOCATION_ENABLED';
    monitorConnection: 'xstate.init';
    requestBluetooth: 'BLUETOOTH_STATE_DISABLED';
    requestNearByDevicesPermission: 'NEARBY_DISABLED';
    sendVc:
      | 'ACCEPT_REQUEST'
      | 'FACE_VALID'
      | 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
    startConnection: 'SCAN';
  };
  'matchesStates':
    | 'bluetoothDenied'
    | 'bluetoothPermissionDenied'
    | 'checkBluetoothPermission'
    | 'checkBluetoothPermission.checking'
    | 'checkBluetoothPermission.enabled'
    | 'checkBluetoothState'
    | 'checkBluetoothState.checking'
    | 'checkBluetoothState.enabled'
    | 'checkBluetoothState.requesting'
    | 'checkNearbyDevicesPermission'
    | 'checkNearbyDevicesPermission.checking'
    | 'checkNearbyDevicesPermission.enabled'
    | 'checkNearbyDevicesPermission.requesting'
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
    | 'findingConnection'
    | 'handlingBleError'
    | 'inactive'
    | 'invalid'
    | 'nearByDevicesPermissionDenied'
    | 'recheckBluetoothState'
    | 'recheckBluetoothState.checking'
    | 'recheckBluetoothState.enabled'
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
    | 'showQrLogin'
    | 'showQrLogin.idle'
    | 'showQrLogin.navigatingToHome'
    | 'showQrLogin.storing'
    | 'startPermissionCheck'
    | {
        checkBluetoothPermission?: 'checking' | 'enabled';
        checkBluetoothState?: 'checking' | 'enabled' | 'requesting';
        checkNearbyDevicesPermission?: 'checking' | 'enabled' | 'requesting';
        checkingLocationService?:
          | 'checkingPermission'
          | 'checkingStatus'
          | 'denied'
          | 'disabled'
          | 'requestingToEnable';
        connecting?: 'inProgress' | 'timeout';
        recheckBluetoothState?: 'checking' | 'enabled';
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
        showQrLogin?: 'idle' | 'navigatingToHome' | 'storing';
      };
  'tags': never;
}
