import {useSelector} from '@xstate/react';
import {ActorRefFrom} from 'xstate';
import {
  selectAcceptingBindingOtp,
  selectBindingAuthFailedError,
  selectBindingWarning,
  selectIsEmail,
  selectIsPhoneNumber,
  selectIsPinned,
  selectKebabPopUp,
  selectRemoveWalletWarning,
  selectShowActivities,
  selectShowWalletBindingError,
  selectWalletBindingInProgress,
  selectWalletBindingResponse,
} from '../machines/VCItemMachine/commonSelectors';
import {selectActivities} from '../machines/activityLog';
import {GlobalContext} from '../shared/GlobalContext';
import {useContext} from 'react';
import {VCMetadata} from '../shared/VCMetadata';
import {ScanEvents} from '../machines/bleShare/scan/scanMachine';
import {BOTTOM_TAB_ROUTES, ScanStackParamList} from '../routes/routesConstants';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {selectIsScanning} from '../machines/bleShare/scan/selectors';
import {
  VCItemEvents,
  VCItemMachine,
} from '../machines/VCItemMachine/VCItemMachine';
import {selectError} from '../machines/biometrics';

type ScanLayoutNavigation = NavigationProp<ScanStackParamList>;

export function useKebabPopUp(props) {
  const service = props.service as ActorRefFrom<typeof VCItemMachine>;
  const navigation = useNavigation<ScanLayoutNavigation>();

  const {appService} = useContext(GlobalContext);
  const activityLogService = appService.children.get('activityLog');
  const scanService = appService.children.get('scan');

  return {
    PIN_CARD: () => service.send(VCItemEvents.PIN_CARD()),
    KEBAB_POPUP: () => service.send(VCItemEvents.KEBAB_POPUP()),
    ADD_WALLET_BINDING_ID: () =>
      service.send(VCItemEvents.ADD_WALLET_BINDING_ID()),
    CONFIRM: () => service.send(VCItemEvents.CONFIRM()),
    GOTO_SCANSCREEN: () => {
      navigation.navigate(BOTTOM_TAB_ROUTES.share);
    },
    DISMISS: () => service.send(VCItemEvents.DISMISS()),
    REMOVE: (vcMetadata: VCMetadata) =>
      service.send(VCItemEvents.REMOVE(vcMetadata)),
    CANCEL: () => service.send(VCItemEvents.CANCEL()),
    INPUT_OTP: (otp: string) => service.send(VCItemEvents.INPUT_OTP(otp)),
    RESEND_OTP: () => service.send(VCItemEvents.RESEND_OTP()),
    SHOW_ACTIVITY: () => service.send(VCItemEvents.SHOW_ACTIVITY()),
    SELECT_VC_ITEM: (
      vcRef: ActorRefFrom<typeof VCItemMachine>,
      flowType: string,
    ) => {
      const {serviceRefs, ...vcData} = vcRef.getSnapshot().context;
      scanService.send(ScanEvents.SELECT_VC(vcData, flowType));
    },

    isPinned: useSelector(service, selectIsPinned),
    isScanning: useSelector(scanService, selectIsScanning),
    isBindingWarning: useSelector(service, selectBindingWarning),
    isAcceptingOtpInput: useSelector(service, selectAcceptingBindingOtp),
    isWalletBindingError: useSelector(service, selectShowWalletBindingError),
    walletBindingError: useSelector(service, selectError),
    bindingAuthFailedError: useSelector(service, selectBindingAuthFailedError),
    otpError: useSelector(service, selectError),
    walletBindingResponse: useSelector(service, selectWalletBindingResponse),
    isKebabPopUp: useSelector(service, selectKebabPopUp),
    isShowActivities: useSelector(service, selectShowActivities),
    isRemoveWalletWarning: useSelector(service, selectRemoveWalletWarning),
    activities: useSelector(activityLogService, selectActivities),
    phoneNumber: useSelector(service, selectIsPhoneNumber),
    email: useSelector(service, selectIsEmail),
    WalletBindingInProgress: useSelector(
      service,
      selectWalletBindingInProgress,
    ),
  };
}
