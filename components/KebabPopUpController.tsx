import {useSelector} from '@xstate/react';
import {ActorRefFrom} from 'xstate';
import {
  selectBindingAuthFailedError,
  selectEmptyWalletBindingId,
  selectIsPinned,
  selectKebabPopUp,
  selectAcceptingBindingOtp,
  selectBindingWarning,
  selectWalletBindingInProgress,
  selectOtpError,
  selectRemoveWalletWarning,
  selectShowActivities,
  selectShowWalletBindingError,
  selectWalletBindingError,
} from '../machines/VCItemMachine/commonSelectors';
import {
  ExistingMosipVCItemEvents,
  ExistingMosipVCItemMachine,
} from '../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {
  EsignetMosipVCItemEvents,
  EsignetMosipVCItemMachine,
} from '../machines/VCItemMachine/EsignetMosipVCItem/EsignetMosipVCItemMachine';
import {selectActivities} from '../machines/activityLog';
import {GlobalContext} from '../shared/GlobalContext';
import {useContext, useState} from 'react';
import {VCMetadata} from '../shared/VCMetadata';
import {ScanEvents} from '../machines/bleShare/scan/scanMachine';
import {
  BOTTOM_TAB_ROUTES,
  SCAN_ROUTES,
  ScanStackParamList,
} from '../routes/routesConstants';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {MainBottomTabParamList} from '../routes/main';
import {selectIsScanning} from '../machines/bleShare/scan/selectors';

type ScanLayoutNavigation = NavigationProp<
  ScanStackParamList & MainBottomTabParamList
>;

export function useKebabPopUp(props) {
  const service = props.service as
    | ActorRefFrom<typeof ExistingMosipVCItemMachine>
    | ActorRefFrom<typeof EsignetMosipVCItemMachine>;
  const navigation = useNavigation<ScanLayoutNavigation>();
  const vcEvents =
    props.vcKey !== undefined && props.vcMetadata.isFromOpenId4VCI()
      ? EsignetMosipVCItemEvents
      : ExistingMosipVCItemEvents;
  const PIN_CARD = () => service.send(vcEvents.PIN_CARD());
  const KEBAB_POPUP = () => service.send(vcEvents.KEBAB_POPUP());
  const ADD_WALLET_BINDING_ID = () =>
    service.send(vcEvents.ADD_WALLET_BINDING_ID());
  const CONFIRM = () => service.send(vcEvents.CONFIRM());
  const REMOVE = (vcMetadata: VCMetadata) =>
    service.send(vcEvents.REMOVE(vcMetadata));
  const DISMISS = () => service.send(vcEvents.DISMISS());
  const CANCEL = () => service.send(vcEvents.CANCEL());
  const SHOW_ACTIVITY = () => service.send(vcEvents.SHOW_ACTIVITY());
  const INPUT_OTP = (otp: string) => service.send(vcEvents.INPUT_OTP(otp));
  const RESEND_OTP = () => service.send(vcEvents.RESEND_OTP());
  const isPinned = useSelector(service, selectIsPinned);
  const isBindingWarning = useSelector(service, selectBindingWarning);
  const isRemoveWalletWarning = useSelector(service, selectRemoveWalletWarning);
  const isAcceptingOtpInput = useSelector(service, selectAcceptingBindingOtp);
  const isWalletBindingError = useSelector(
    service,
    selectShowWalletBindingError,
  );
  const otpError = useSelector(service, selectOtpError);
  const walletBindingError = useSelector(service, selectWalletBindingError);
  const bindingAuthFailedError = useSelector(
    service,
    selectBindingAuthFailedError,
  );
  const WalletBindingInProgress = useSelector(
    service,
    selectWalletBindingInProgress,
  );
  const emptyWalletBindingId = useSelector(service, selectEmptyWalletBindingId);
  const isKebabPopUp = useSelector(service, selectKebabPopUp);
  const isShowActivities = useSelector(service, selectShowActivities);

  const {appService} = useContext(GlobalContext);
  const activityLogService = appService.children.get('activityLog');
  const scanService = appService.children.get('scan');
  const isScanning = useSelector(scanService, selectIsScanning);

  const GOTO_SCANSCREEN = () => {
    navigation.navigate(BOTTOM_TAB_ROUTES.share);
  };

  return {
    isPinned,
    PIN_CARD,
    KEBAB_POPUP,
    ADD_WALLET_BINDING_ID,
    CONFIRM,
    GOTO_SCANSCREEN,
    DISMISS,
    REMOVE,
    CANCEL,
    INPUT_OTP,
    RESEND_OTP,
    SHOW_ACTIVITY,
    SELECT_VC_ITEM: (
      vcRef: ActorRefFrom<typeof ExistingMosipVCItemMachine>,
      flowType: string,
    ) => {
      const {serviceRefs, ...vcData} = vcRef.getSnapshot().context;
      scanService.send(ScanEvents.SELECT_VC(vcData, flowType));
    },
    isScanning,
    isBindingWarning,
    isAcceptingOtpInput,
    isWalletBindingError,
    walletBindingError,
    bindingAuthFailedError,
    otpError,
    WalletBindingInProgress,
    emptyWalletBindingId,
    isKebabPopUp,
    isShowActivities,
    isRemoveWalletWarning,
    activities: useSelector(activityLogService, selectActivities),
  };
}
