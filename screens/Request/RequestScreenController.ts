import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import { selectIsActive, selectIsFocused } from '../../machines/app';
import { selectVcLabel } from '../../machines/settings';
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
} from '../../machines/openIdBle/request/selectors';
import {
  selectIsBluetoothDenied,
  selectIsCancelling,
  selectIsExchangingDeviceInfo,
  selectIsExchangingDeviceInfoTimeout,
  selectIsOffline,
  selectIsReviewing,
} from '../../machines/openIdBle/commonSelectors';
import { RequestEvents } from '../../machines/openIdBle/request/requestMachine';

export function useRequestScreen() {
  const { t } = useTranslation('RequestScreen');
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');
  const vcLabel = useSelector(settingsService, selectVcLabel);

  const requestService = appService.children.get('request');
  const isActive = useSelector(appService, selectIsActive);
  const isFocused = useSelector(appService, selectIsFocused);
  const isBluetoothDenied = useSelector(
    requestService,
    selectIsBluetoothDenied
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
    statusMessage = t('status.connected.message', {
      vcLabel: vcLabel.singular,
    });
  } else if (isWaitingForVcTimeout) {
    statusMessage = t('status.connected.message', {
      vcLabel: vcLabel.singular,
    });
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
    vcLabel,
    statusMessage,
    statusHint,
    sharingProtocol: useSelector(requestService, selectSharingProtocol),

    isWaitingForConnection,
    isExchangingDeviceInfo,

    isStatusCancellable,
    isWaitingForVc,
    isBluetoothDenied,
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
