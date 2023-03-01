import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import { selectIsActive, selectIsFocused } from '../../machines/app';
import {
  TimerBaseRequestEvents,
  selectIsBluetoothDenied,
  selectConnectionParams,
  selectIsReviewing,
  selectSenderInfo,
  selectIsWaitingForConnection,
  selectIsExchangingDeviceInfo,
  selectIsWaitingForVc,
  selectSharingProtocol,
  selectIsExchangingDeviceInfoTimeout,
  selectIsWaitingForVcTimeout,
  selectIsCheckingBluetoothService,
  selectIsCancelling,
  selectIsOffline,
} from '../../machines/TimerBaseRequest';
import { selectVcLabel } from '../../machines/settings';
import { GlobalContext } from '../../shared/GlobalContext';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { useTranslation } from 'react-i18next';

export function useRequestScreen() {
  const { t } = useTranslation('RequestScreen');
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');
  const vcLabel = useSelector(settingsService, selectVcLabel);

  const requestService = appService.children.get('timerBaseRequest');
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
        requestService.send(TimerBaseRequestEvents.SCREEN_FOCUS());
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
    connectionParams: useSelector(requestService, selectConnectionParams),
    senderInfo: useSelector(requestService, selectSenderInfo),
    isReviewing: useSelector(requestService, selectIsReviewing),
    isCancelling: useSelector(requestService, selectIsCancelling),

    CANCEL: () => requestService.send(TimerBaseRequestEvents.CANCEL()),
    DISMISS: () => requestService.send(TimerBaseRequestEvents.DISMISS()),
    ACCEPT: () => requestService.send(TimerBaseRequestEvents.ACCEPT()),
    REJECT: () => requestService.send(TimerBaseRequestEvents.REJECT()),
    REQUEST: () => requestService.send(TimerBaseRequestEvents.SCREEN_FOCUS()),
    SWITCH_PROTOCOL: (value: boolean) =>
      requestService.send(TimerBaseRequestEvents.SWITCH_PROTOCOL(value)),
    GOTO_SETTINGS: () =>
      requestService.send(TimerBaseRequestEvents.GOTO_SETTINGS()),
  };
}
