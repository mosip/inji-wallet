import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import { selectIsActive, selectIsFocused } from '../../machines/app';
import { GlobalContext } from '../../shared/GlobalContext';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { useTranslation } from 'react-i18next';
import {
  selectIsCheckingBluetoothService,
  selectIsWaitingForConnection,
  selectIsWaitingForVc,
  selectIsWaitingForVcTimeout,
  selectOpenId4VpUri,
  selectSenderInfo,
  selectSharingProtocol,
} from '../../machines/bleShare/request/selectors';
import {
  selectIsBluetoothDenied,
  selectIsCancelling,
  selectIsExchangingDeviceInfo,
  selectIsExchangingDeviceInfoTimeout,
  selectIsNearByDevicesPermissionDenied,
  selectIsOffline,
  selectIsReviewing,
  selectReadyForBluetoothStateCheck,
} from '../../machines/bleShare/commonSelectors';
import { RequestEvents } from '../../machines/bleShare/request/requestMachine';

export function useRequestScreen() {
  const { t } = useTranslation('RequestScreen');
  const { appService } = useContext(GlobalContext);

  const requestService = appService.children.get('request');
  const isActive = useSelector(appService, selectIsActive);
  const isFocused = useSelector(appService, selectIsFocused);
  const isReadyForBluetoothStateCheck = useSelector(
    requestService,
    selectReadyForBluetoothStateCheck
  );
  const isBluetoothDenied = useSelector(
    requestService,
    selectIsBluetoothDenied
  );
  const isNearByDevicesPermissionDenied = useSelector(
    requestService,
    selectIsNearByDevicesPermissionDenied
  );
  const isWaitingForConnection = useSelector(
    requestService,
    selectIsWaitingForConnection
  );
  const isExchangingDeviceInfo = useSelector(
    requestService,
    selectIsExchangingDeviceInfo
  );
  const isExchangingDeviceInfoTimeout = useSelector(
    requestService,
    selectIsExchangingDeviceInfoTimeout
  );
  const isWaitingForVc = useSelector(requestService, selectIsWaitingForVc);
  const isWaitingForVcTimeout = useSelector(
    requestService,
    selectIsWaitingForVcTimeout
  );
  const isOffline = useSelector(requestService, selectIsOffline);

  let statusMessage = '';
  let statusHint = '';
  let isStatusCancellable = false;
  if (isWaitingForConnection) {
    statusMessage = t('status.waitingConnection');
  } else if (isExchangingDeviceInfo) {
    statusMessage = t('status.exchangingDeviceInfo.message');
  } else if (isOffline) {
    statusMessage = t('status.offline.message');
  } else if (isExchangingDeviceInfoTimeout) {
    statusMessage = t('status.exchangingDeviceInfo.message');
    statusHint = t('status.exchangingDeviceInfo.timeoutHint');
    isStatusCancellable = true;
  } else if (isWaitingForVc) {
    statusMessage = t('status.connected.message');
  } else if (isWaitingForVcTimeout) {
    statusMessage = t('status.connected.message');
    statusHint = t('status.connected.timeoutHint');
    isStatusCancellable = true;
  }

  useEffect(() => {
    BluetoothStateManager.getState().then((bluetoothState) => {
      if (bluetoothState === 'PoweredOn' && isBluetoothDenied) {
        requestService.send(RequestEvents.SCREEN_FOCUS());
      }
    });
  }, [isFocused, isActive]);

  return {
    statusMessage,
    statusHint,
    sharingProtocol: useSelector(requestService, selectSharingProtocol),

    isWaitingForConnection,
    isExchangingDeviceInfo,

    isStatusCancellable,
    isWaitingForVc,
    isBluetoothDenied,
    isNearByDevicesPermissionDenied,
    isReadyForBluetoothStateCheck,
    isCheckingBluetoothService: useSelector(
      requestService,
      selectIsCheckingBluetoothService
    ),
    openId4VpUri: useSelector(requestService, selectOpenId4VpUri),
    senderInfo: useSelector(requestService, selectSenderInfo),
    isReviewing: useSelector(requestService, selectIsReviewing),
    isCancelling: useSelector(requestService, selectIsCancelling),

    CANCEL: () => requestService.send(RequestEvents.CANCEL()),
    DISMISS: () => requestService.send(RequestEvents.DISMISS()),
    ACCEPT: () => requestService.send(RequestEvents.ACCEPT()),
    REJECT: () => requestService.send(RequestEvents.REJECT()),
    REQUEST: () => requestService.send(RequestEvents.SCREEN_FOCUS()),
    GOTO_SETTINGS: () => requestService.send(RequestEvents.GOTO_SETTINGS()),
  };
}
