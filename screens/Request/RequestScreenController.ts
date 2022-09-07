import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import { selectIsActive, selectIsFocused } from '../../machines/app';
import {
  RequestEvents,
  selectIsBluetoothDenied,
  selectConnectionParams,
  selectIsReviewing,
  selectSenderInfo,
  selectIsWaitingForConnection,
  selectIsExchangingDeviceInfo,
  selectIsWaitingForVc,
  selectSharingProtocol,
} from '../../machines/request';
import { selectVcLabel } from '../../machines/settings';
import { GlobalContext } from '../../shared/GlobalContext';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { useTranslation } from 'react-i18next';

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
  const isWaitingForVc = useSelector(requestService, selectIsWaitingForVc);

  let statusMessage = '';
  if (isWaitingForConnection) {
    statusMessage = t('status.waitingConnection');
  } else if (isExchangingDeviceInfo) {
    statusMessage = t('status.exchangingDeviceInfo');
  } else if (isWaitingForVc) {
    statusMessage = t('status.connected', { vcLabel: vcLabel.singular });
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
    sharingProtocol: useSelector(requestService, selectSharingProtocol),

    isWaitingForConnection,
    isExchangingDeviceInfo,

    isWaitingForVc,
    isBluetoothDenied,
    connectionParams: useSelector(requestService, selectConnectionParams),
    senderInfo: useSelector(requestService, selectSenderInfo),
    isReviewing: useSelector(requestService, selectIsReviewing),

    DISMISS: () => requestService.send(RequestEvents.DISMISS()),
    ACCEPT: () => requestService.send(RequestEvents.ACCEPT()),
    REJECT: () => requestService.send(RequestEvents.REJECT()),
    REQUEST: () => requestService.send(RequestEvents.SCREEN_FOCUS()),
    SWITCH_PROTOCOL: (value: boolean) =>
      requestService.send(RequestEvents.SWITCH_PROTOCOL(value)),
    GOTO_SETTINGS: () => requestService.send(RequestEvents.GOTO_SETTINGS()),
  };
}
