import {useSelector} from '@xstate/react';
import {ActorRefFrom} from 'xstate';
import {
  selectAcceptingBindingOtp,
  selectBindingAuthFailedError,
  selectBindingWarning,
  selectIsCommunicationDetails,
  selectIsPinned,
  selectKebabPopUp,
  selectRemoveWalletWarning,
  selectShowActivities,
  selectShowWalletBindingError,
  selectWalletBindingInProgress,
} from '../machines/VCItemMachine/VCItemMachine';
import {selectActivities} from '../machines/activityLog';
import {GlobalContext} from '../shared/GlobalContext';
import {useContext} from 'react';
import {VCMetadata} from '../shared/VCMetadata';
import {ScanEvents} from '../machines/bleShare/scan/scanMachine';
import {BOTTOM_TAB_ROUTES, ScanStackParamList} from '../routes/routesConstants';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {MainBottomTabParamList} from '../routes/main';
import {selectIsScanning} from '../machines/bleShare/scan/selectors';
import {
  VCItemEvents,
  VCItemMachine,
} from '../machines/VCItemMachine/VCItemMachine';
import {selectError} from '../machines/biometrics';

type ScanLayoutNavigation = NavigationProp<
  ScanStackParamList & MainBottomTabParamList
>;

export function useKebabPopUp(props) {
  const service = props.service as ActorRefFrom<typeof VCItemMachine>;
  const navigation = useNavigation<ScanLayoutNavigation>();
  const vcEvents = VCItemEvents;
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
  const otpError = useSelector(service, selectError);
  const walletBindingError = useSelector(service, selectError);
  const bindingAuthFailedError = useSelector(
    service,
    selectBindingAuthFailedError,
  );
  const WalletBindingInProgress = useSelector(
    service,
    selectWalletBindingInProgress,
  );

  const isKebabPopUp = useSelector(service, selectKebabPopUp);
  const isShowActivities = useSelector(service, selectShowActivities);
  const communicationDetails = useSelector(
    service,
    selectIsCommunicationDetails,
  );
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
      vcRef: ActorRefFrom<typeof VCItemMachine>,
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
    isKebabPopUp,
    isShowActivities,
    isRemoveWalletWarning,
    activities: useSelector(activityLogService, selectActivities),
    communicationDetails,
  };
}
