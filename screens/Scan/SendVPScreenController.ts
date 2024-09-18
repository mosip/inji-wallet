import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useSelector} from '@xstate/react';
import {useContext, useState} from 'react';
import {ActorRefFrom} from 'xstate';
import {Theme} from '../../components/ui/styleUtils';
import {selectIsCancelling} from '../../machines/bleShare/commonSelectors';
import {ScanEvents} from '../../machines/bleShare/scan/scanMachine';
import {
  selectIsSelectingVc,
  selectReceiverInfo,
  selectVcName,
} from '../../machines/bleShare/scan/scanSelectors';
import {OpenId4VPEvents} from '../../machines/openId4VP/openId4VPMachine';
import {
  selectAreAllVCsChecked,
  selectCredentials,
  selectIsFaceVerificationConsent,
  selectIsGetVCsSatisfyingAuthRequest,
  selectIsGetVPSharingConsent,
  selectIsInvalidIdentity,
  selectIsSharingVP,
  selectIsVerifyingIdentity,
  selectVCsMatchingAuthRequest,
  selectVerifiableCredentialsData,
} from '../../machines/openId4VP/openId4VPSelectors';
import {selectMyVcs} from '../../machines/QrLogin/QrLoginSelectors';
import {VCItemMachine} from '../../machines/VerifiableCredential/VCItemMachine/VCItemMachine';
import {selectShareableVcs} from '../../machines/VerifiableCredential/VCMetaMachine/VCMetaSelectors';
import {RootRouteProps} from '../../routes';
import {BOTTOM_TAB_ROUTES} from '../../routes/routesConstants';
import {GlobalContext} from '../../shared/GlobalContext';
import {VCMetadata} from '../../shared/VCMetadata';
import {MessageOverlayProps} from '../../components/MessageOverlay';
import {useTranslation} from 'react-i18next';

type MyVcsTabNavigation = NavigationProp<RootRouteProps>;

const changeTabBarVisible = (visible: string) => {
  Theme.BottomTabBarStyle.tabBarStyle.display = visible;
};

export function getVcsForVPSharing(vcMetadatas: VCMetadata[]) {}

export function useSendVPScreen() {
  const {t} = useTranslation('ScanScreen');
  const {appService} = useContext(GlobalContext);
  const scanService = appService.children.get('scan')!!;
  const vcMetaService = appService.children.get('vcMeta')!!;
  const navigation = useNavigation<MyVcsTabNavigation>();
  const openId4VPService = scanService.getSnapshot().context.OpenId4VPRef;
  const [selectedVCKeys, setSelectedVCKeys] = useState<Record<string, string>>(
    {},
  );
  const shareableVcs = useSelector(vcMetaService, selectShareableVcs);

  const myVcs = useSelector(vcMetaService, selectMyVcs);

  const isGetVCsSatisfyingAuthRequest = useSelector(
    openId4VPService,
    selectIsGetVCsSatisfyingAuthRequest,
  );

  if (isGetVCsSatisfyingAuthRequest) {
    openId4VPService.send('DOWNLOADED_VCS', {vcs: shareableVcs});
  }

  const areAllVCsChecked = useSelector(
    openId4VPService,
    selectAreAllVCsChecked,
  );
  const vcsMatchingAuthRequest = useSelector(
    openId4VPService,
    selectVCsMatchingAuthRequest,
  );

  const getSelectedVCs = () => {
    var selectedVcsData = {};
    Object.entries(selectedVCKeys).map(([vcKey, inputDescriptorId]) => {
      const vcData = myVcs[vcKey];
      selectedVcsData[inputDescriptorId] ??= [];
      selectedVcsData[inputDescriptorId].push(vcData);
    });
    return selectedVcsData;
  };

  const isSendingVP = useSelector(openId4VPService, selectIsSharingVP);

  return {
    isSendingVP,
    vcsMatchingAuthRequest,
    areAllVCsChecked,
    selectedVCKeys,
    receiverInfo: useSelector(scanService, selectReceiverInfo),
    vcName: useSelector(scanService, selectVcName),
    isSelectingVc: useSelector(scanService, selectIsSelectingVc),
    isVerifyingIdentity: useSelector(
      openId4VPService,
      selectIsVerifyingIdentity,
    ),
    isInvalidIdentity: useSelector(openId4VPService, selectIsInvalidIdentity),
    isCancelling: useSelector(scanService, selectIsCancelling),
    isFaceVerificationConsent: useSelector(
      openId4VPService,
      selectIsFaceVerificationConsent,
    ),
    isVPSharingConsent: useSelector(
      openId4VPService,
      selectIsGetVPSharingConsent,
    ),
    credentials: useSelector(openId4VPService, selectCredentials),
    verifiableCredentialsData: useSelector(
      openId4VPService,
      selectVerifiableCredentialsData,
    ),
    FACE_VERIFICATION_CONSENT: (isDoNotAskAgainChecked: boolean) =>
      openId4VPService.send(
        OpenId4VPEvents.FACE_VERIFICATION_CONSENT(isDoNotAskAgainChecked),
      ),
    DISMISS: () => scanService.send(ScanEvents.DISMISS()),
    UPDATE_VC_NAME: (vcName: string) =>
      scanService.send(ScanEvents.UPDATE_VC_NAME(vcName)),
    FACE_VALID: () => openId4VPService.send(OpenId4VPEvents.FACE_VALID()),
    FACE_INVALID: () => openId4VPService.send(OpenId4VPEvents.FACE_INVALID()),
    RETRY_VERIFICATION: () =>
      openId4VPService.send(OpenId4VPEvents.RETRY_VERIFICATION()),
    GO_TO_HOME: () => {
      navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'});
      changeTabBarVisible('flex');
    },
    SELECT_VC_ITEM:
      (vcKey: string, inputDescriptorId: string) =>
      (vcRef: ActorRefFrom<typeof VCItemMachine>) => {
        var selectedVcs = {...selectedVCKeys};
        console.log('sel vcs%%', selectedVcs);
        var isVCSelected = !!!selectedVcs[vcKey];
        if (isVCSelected) {
          selectedVcs[vcKey] = inputDescriptorId;
        } else {
          delete selectedVcs[vcKey];
        }
        setSelectedVCKeys(selectedVcs);
        const {serviceRefs, wellknownResponse, ...vcData} =
          vcRef.getSnapshot().context;
      },

    UNCHECK_ALL: () => {
      setSelectedVCKeys({});
    },

    CHECK_ALL: () => {
      var updatedVCsList = {};
      Object.entries(vcsMatchingAuthRequest).map(([inputDescriptorId, vcs]) => {
        vcs.map(vcData => {
          const vcKey = VCMetadata.fromVcMetadataString(
            vcData.vcMetadata,
          ).getVcKey();
          updatedVCsList[vcKey] = inputDescriptorId;
        });
      });
      setSelectedVCKeys({...updatedVCsList});
    },

    ACCEPT_REQUEST: () => {
      openId4VPService.send(OpenId4VPEvents.ACCEPT_REQUEST(getSelectedVCs()));
    },

    VERIFY_AND_ACCEPT_REQUEST: () => {
      openId4VPService.send(
        OpenId4VPEvents.VERIFY_AND_ACCEPT_REQUEST(getSelectedVCs()),
      );
    },

    CONFIRM: () => openId4VPService.send(OpenId4VPEvents.CONFIRM()),

    CANCEL: () => openId4VPService.send(OpenId4VPEvents.CANCEL()),
  };
}
