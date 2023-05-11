import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageOverlayProps } from '../../components/MessageOverlay';
import { selectVcLabel } from '../../machines/settings';
import { MainBottomTabParamList } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';
import {
  selectIsConnecting,
  selectIsConnectingTimeout,
  selectIsInvalid,
  selectIsLocationDenied,
  selectIsLocationDisabled,
  selectIsQrLoginDone,
  selectIsScanning,
  selectIsSendingVc,
  selectIsSendingVcTimeout,
  selectIsSent,
  selectReceiverInfo,
} from '../../machines/openIdBle/scan/selectors';
import {
  selectIsAccepted,
  selectIsDisconnected,
  selectIsDone,
  selectIsExchangingDeviceInfo,
  selectIsExchangingDeviceInfoTimeout,
  selectIsHandlingBleError,
  selectIsOffline,
  selectIsRejected,
  selectIsReviewing,
} from '../../machines/openIdBle/commonSelectors';
import { ScanEvents } from '../../machines/openIdBle/scan/machine';

type ScanStackParamList = {
  ScanScreen: undefined;
  SendVcScreen: undefined;
};

type ScanLayoutNavigation = NavigationProp<
  ScanStackParamList & MainBottomTabParamList
>;

// TODO: refactor
// eslint-disable-next-line sonarjs/cognitive-complexity
export function useScanLayout() {
  const { t } = useTranslation('ScanScreen');
  const { appService } = useContext(GlobalContext);
  const scanService = appService.children.get('scan');
  const settingsService = appService.children.get('settings');
  const navigation = useNavigation<ScanLayoutNavigation>();

  const isLocationDisabled = useSelector(scanService, selectIsLocationDisabled);
  const isLocationDenied = useSelector(scanService, selectIsLocationDenied);
  const isBleError = useSelector(scanService, selectIsHandlingBleError);

  const locationError = { message: '', button: '' };

  if (isLocationDisabled) {
    locationError.message = t('errors.locationDisabled.message');
    locationError.button = t('errors.locationDisabled.button');
  } else if (isLocationDenied) {
    locationError.message = t('errors.locationDenied.message');
    locationError.button = t('errors.locationDenied.button');
  }

  const DISMISS = () => scanService.send(ScanEvents.DISMISS());
  const CANCEL = () => scanService.send(ScanEvents.CANCEL());

  const receiverInfo = useSelector(scanService, selectReceiverInfo);

  const isInvalid = useSelector(scanService, selectIsInvalid);
  const isConnecting = useSelector(scanService, selectIsConnecting);
  const isConnectingTimeout = useSelector(
    scanService,
    selectIsConnectingTimeout
  );
  const isExchangingDeviceInfo = useSelector(
    scanService,
    selectIsExchangingDeviceInfo
  );
  const isExchangingDeviceInfoTimeout = useSelector(
    scanService,
    selectIsExchangingDeviceInfoTimeout
  );
  const isAccepted = useSelector(scanService, selectIsAccepted);
  const isRejected = useSelector(scanService, selectIsRejected);
  const isSent = useSelector(scanService, selectIsSent);
  const isOffline = useSelector(scanService, selectIsOffline);
  const isSendingVc = useSelector(scanService, selectIsSendingVc);
  const isSendingVcTimeout = useSelector(scanService, selectIsSendingVcTimeout);

  const vcLabel = useSelector(settingsService, selectVcLabel);

  const onCancel = () => scanService.send(ScanEvents.CANCEL());
  let statusOverlay: Pick<
    MessageOverlayProps,
    'title' | 'message' | 'hint' | 'onCancel' | 'progress' | 'onBackdropPress'
  > = null;
  if (isConnecting) {
    statusOverlay = {
      message: t('status.connecting'),
      progress: true,
    };
  } else if (isConnectingTimeout) {
    statusOverlay = {
      message: t('status.connecting'),
      hint: t('status.connectingTimeout'),
      onCancel,
      progress: true,
    };
  } else if (isExchangingDeviceInfo) {
    statusOverlay = {
      message: t('status.exchangingDeviceInfo'),
      progress: true,
    };
  } else if (isExchangingDeviceInfoTimeout) {
    statusOverlay = {
      message: t('status.exchangingDeviceInfo'),
      hint: t('status.exchangingDeviceInfoTimeout'),
      onCancel,
      progress: true,
    };
  } else if (isSent) {
    statusOverlay = {
      message: t('status.sent', { vcLabel: vcLabel.singular }),
      hint: t('status.sentHint', { vcLabel: vcLabel.singular }),
    };
  } else if (isSendingVc) {
    statusOverlay = {
      title: t('status.sharing.title'),
      hint: t('status.sharing.hint'),
      progress: true,
    };
  } else if (isSendingVcTimeout) {
    statusOverlay = {
      title: t('status.sharing.title'),
      hint: t('status.sharing.timeoutHint'),
      onCancel: CANCEL,
      progress: true,
    };
  } else if (isAccepted) {
    statusOverlay = {
      title: t('status.accepted.title'),
      message: t('status.accepted.message', {
        vcLabel: vcLabel.singular,
        receiver: receiverInfo.deviceName,
      }),
      onBackdropPress: DISMISS,
    };
  } else if (isRejected) {
    statusOverlay = {
      title: t('status.rejected.title'),
      message: t('status.rejected.message', {
        vcLabel: vcLabel.singular,
        receiver: receiverInfo.deviceName,
      }),
      onBackdropPress: DISMISS,
    };
  } else if (isInvalid) {
    statusOverlay = {
      message: t('status.invalid'),
      onBackdropPress: DISMISS,
    };
  } else if (isOffline) {
    statusOverlay = {
      message: t('status.offline'),
      onBackdropPress: DISMISS,
    };
  } else if (isBleError) {
    statusOverlay = {
      title: t('status.bleError.title'),
      message: t('status.bleError.message', {
        vcLabel: vcLabel.singular,
      }),
      onBackdropPress: DISMISS,
    };
  }

  useEffect(() => {
    const subscriptions = [
      navigation.addListener('focus', () =>
        scanService.send(ScanEvents.SCREEN_FOCUS())
      ),
      navigation.addListener('blur', () =>
        scanService.send(ScanEvents.SCREEN_BLUR())
      ),
    ];

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const isDone = useSelector(scanService, selectIsDone);
  const isReviewing = useSelector(scanService, selectIsReviewing);
  const isScanning = useSelector(scanService, selectIsScanning);
  const isQrLoginDone = useSelector(scanService, selectIsQrLoginDone);

  useEffect(() => {
    if (isDone) {
      navigation.navigate('Home', { activeTab: 0 });
    } else if (isReviewing) {
      navigation.navigate('SendVcScreen');
    } else if (isScanning) {
      navigation.navigate('ScanScreen');
    } else if (isQrLoginDone) {
      navigation.navigate('Home', { activeTab: 2 });
    }
  }, [isDone, isReviewing, isScanning, isQrLoginDone, isBleError]);

  return {
    vcLabel,

    isInvalid,
    isDone,
    isDisconnected: useSelector(scanService, selectIsDisconnected),
    statusOverlay,

    DISMISS,
  };
}
