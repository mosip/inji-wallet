import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSelector } from '@xstate/react';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageOverlayProps } from '../../components/MessageOverlay';
import {
  ScanEvents,
  selectIsInvalid,
  selectIsLocationDisabled,
  selectIsLocationDenied,
  selectIsConnecting,
  selectIsExchangingDeviceInfo,
  selectIsConnectingTimeout,
  selectIsExchangingDeviceInfoTimeout,
  selectIsDone,
  selectIsReviewing,
  selectIsScanning,
  selectIsOffline,
  selectIsSent,
  selectIsDisconnected,
} from '../../machines/scan';
import { selectVcLabel } from '../../machines/settings';
import { MainBottomTabParamList } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';

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

  const locationError = { message: '', button: '' };

  if (isLocationDisabled) {
    locationError.message = t('errors.locationDisabled.message');
    locationError.button = t('errors.locationDisabled.button');
  } else if (isLocationDenied) {
    locationError.message = t('errors.locationDenied.message');
    locationError.button = t('errors.locationDenied.button');
  }

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
  const isOffline = useSelector(scanService, selectIsOffline);
  const isSent = useSelector(scanService, selectIsSent);

  const vcLabel = useSelector(settingsService, selectVcLabel);

  const onCancel = () => scanService.send(ScanEvents.CANCEL());
  let statusOverlay: Pick<
    MessageOverlayProps,
    'message' | 'hint' | 'onCancel'
  > = null;
  if (isConnecting) {
    statusOverlay = {
      message: t('status.connecting'),
    };
  } else if (isConnectingTimeout) {
    statusOverlay = {
      message: t('status.connecting'),
      hint: t('status.connectingTimeout'),
      onCancel,
    };
  } else if (isExchangingDeviceInfo) {
    statusOverlay = {
      message: t('status.exchangingDeviceInfo'),
    };
  } else if (isExchangingDeviceInfoTimeout) {
    statusOverlay = {
      message: t('status.exchangingDeviceInfo'),
      hint: t('status.exchangingDeviceInfoTimeout'),
      onCancel,
    };
  } else if (isSent) {
    statusOverlay = {
      message: t('status.sent', { vcLabel: vcLabel.singular }),
      hint: t('status.sentHint', { vcLabel: vcLabel.singular }),
    };
  } else if (isInvalid) {
    statusOverlay = {
      message: t('status.invalid'),
    };
  } else if (isOffline) {
    statusOverlay = {
      message: t('status.offline'),
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
  useEffect(() => {
    if (isDone) {
      navigation.navigate('Home', { activeTab: 0 });
    } else if (isReviewing) {
      navigation.navigate('SendVcScreen');
    } else if (isScanning) {
      navigation.navigate('ScanScreen');
    }
  }, [isDone, isReviewing, isScanning]);

  return {
    vcLabel,

    isInvalid,
    isDone,
    isDisconnected: useSelector(scanService, selectIsDisconnected),
    statusOverlay,

    DISMISS: () => scanService.send(ScanEvents.DISMISS()),
    DISMISS_INVALID: () =>
      isInvalid ? scanService.send(ScanEvents.DISMISS()) : null,
  };
}
