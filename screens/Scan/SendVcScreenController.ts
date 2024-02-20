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
import {ScanEvents,selectIsFaceVerificationConsent,selectShowFaceAuthConsent} from '../../machines/bleShare/scan/scanMachine';

export function useSendVcScreen() {
  const {appService} = useContext(GlobalContext);
  const scanService = appService.children.get('scan');
  const vcService = appService.children.get('vc');

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
    isFaceVerificationConsent: useSelector(scanService, selectIsFaceVerificationConsent),
    showFaceAuthConsent: useSelector(scanService, selectShowFaceAuthConsent),

    CANCEL,
    ACCEPT_REQUEST: () => scanService.send(ScanEvents.ACCEPT_REQUEST()),
    FACE_VERIFICATION_CONSENT: (showAgain: boolean) => scanService.send(ScanEvents.FACE_VERIFICATION_CONSENT(showAgain)),
    VERIFY_AND_ACCEPT_REQUEST: () =>
      scanService.send(ScanEvents.VERIFY_AND_ACCEPT_REQUEST()),
    DISMISS: () => scanService.send(ScanEvents.DISMISS()),
    UPDATE_VC_NAME: (vcName: string) =>
      scanService.send(ScanEvents.UPDATE_VC_NAME(vcName)),
    FACE_VALID: () => scanService.send(ScanEvents.FACE_VALID()),
    FACE_INVALID: () => scanService.send(ScanEvents.FACE_INVALID()),
    RETRY_VERIFICATION: () => scanService.send(ScanEvents.RETRY_VERIFICATION()),
  };
}
