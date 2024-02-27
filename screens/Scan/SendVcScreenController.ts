import {useSelector} from '@xstate/react';
import {useContext, useState} from 'react';
import {ActorRefFrom} from 'xstate';
import {selectShareableVcsMetadata} from '../../machines/VCItemMachine/vc';
import {ExistingMosipVCItemMachine} from '../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {GlobalContext} from '../../shared/GlobalContext';
import {
  selectIsSelectingVc,
  selectReceiverInfo,
  selectSelectedVc,
  selectVcName,
} from '../../machines/bleShare/scan/selectors';
import {
  selectIsCancelling,
  selectIsInvalidIdentity,
  selectIsVerifyingIdentity,
} from '../../machines/bleShare/commonSelectors';
import {ScanEvents} from '../../machines/bleShare/scan/scanMachine';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootRouteProps} from '../../routes';
import {BOTTOM_TAB_ROUTES} from '../../routes/routesConstants';

type MyVcsTabNavigation = NavigationProp<RootRouteProps>;

export function useSendVcScreen() {
  const {appService} = useContext(GlobalContext);
  const scanService = appService.children.get('scan');
  const vcService = appService.children.get('vc');
  const navigation = useNavigation<MyVcsTabNavigation>();

  const CANCEL = () => scanService.send(ScanEvents.CANCEL());

  const [selectedIndex, setSelectedIndex] = useState<number>(null);

  return {
    selectedIndex,
    TOGGLE_USER_CONSENT: () =>
      scanService.send(ScanEvents.TOGGLE_USER_CONSENT()),
    SELECT_VC_ITEM:
      (index: number) =>
      (vcRef: ActorRefFrom<typeof ExistingMosipVCItemMachine>) => {
        setSelectedIndex(index);
        const {serviceRefs, ...vcData} = vcRef.getSnapshot().context;
        scanService.send(ScanEvents.SELECT_VC(vcData));
      },

    receiverInfo: useSelector(scanService, selectReceiverInfo),
    vcName: useSelector(scanService, selectVcName),
    shareableVcsMetadata: useSelector(vcService, selectShareableVcsMetadata),
    selectedVc: useSelector(scanService, selectSelectedVc),

    isSelectingVc: useSelector(scanService, selectIsSelectingVc),
    isVerifyingIdentity: useSelector(scanService, selectIsVerifyingIdentity),
    isInvalidIdentity: useSelector(scanService, selectIsInvalidIdentity),
    isCancelling: useSelector(scanService, selectIsCancelling),

    CANCEL,
    ACCEPT_REQUEST: () => scanService.send(ScanEvents.ACCEPT_REQUEST()),
    VERIFY_AND_ACCEPT_REQUEST: () =>
      scanService.send(ScanEvents.VERIFY_AND_ACCEPT_REQUEST()),
    DISMISS: () => scanService.send(ScanEvents.DISMISS()),
    UPDATE_VC_NAME: (vcName: string) =>
      scanService.send(ScanEvents.UPDATE_VC_NAME(vcName)),
    FACE_VALID: () => scanService.send(ScanEvents.FACE_VALID()),
    FACE_INVALID: () => scanService.send(ScanEvents.FACE_INVALID()),
    RETRY_VERIFICATION: () => scanService.send(ScanEvents.RETRY_VERIFICATION()),
    GO_TO_HOME: () => {
      navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'});
    },
  };
}
