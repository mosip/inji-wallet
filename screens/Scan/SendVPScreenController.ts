import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useSelector} from '@xstate/react';
import {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActorRefFrom} from 'xstate';
import {Theme} from '../../components/ui/styleUtils';
import {selectIsCancelling} from '../../machines/bleShare/commonSelectors';
import {ScanEvents} from '../../machines/bleShare/scan/scanMachine';
import {
  selectFlowType,
  selectIsSendingVPError,
} from '../../machines/bleShare/scan/scanSelectors';
import {
  selectIsShowLoadingScreen,
  selectOpenID4VPRetryCount,
  selectRequestedClaimsByVerifier,
  selectSelectedVCs,
  selectVerifierNameInVPSharing,
} from '../../machines/openID4VP/openID4VPSelectors';
import {OpenID4VPEvents} from '../../machines/openID4VP/openID4VPMachine';
import {
  selectAreAllVCsChecked,
  selectCredentials,
  selectIsError,
  selectIsFaceVerificationConsent,
  selectIsGetVCsSatisfyingAuthRequest,
  selectIsGetVPSharingConsent,
  selectIsInvalidIdentity,
  selectIsSelectingVcs,
  selectIsSharingVP,
  selectIsVerifyingIdentity,
  selectPurpose,
  selectShowConfirmationPopup,
  selectVCsMatchingAuthRequest,
  selectVerifiableCredentialsData,
} from '../../machines/openID4VP/openID4VPSelectors';
import {selectMyVcs} from '../../machines/QrLogin/QrLoginSelectors';
import {VCItemMachine} from '../../machines/VerifiableCredential/VCItemMachine/VCItemMachine';
import {selectShareableVcs} from '../../machines/VerifiableCredential/VCMetaMachine/VCMetaSelectors';
import {RootRouteProps} from '../../routes';
import {BOTTOM_TAB_ROUTES} from '../../routes/routesConstants';
import {GlobalContext} from '../../shared/GlobalContext';
import {isMosipVC} from '../../shared/Utils';
import {VCMetadata} from '../../shared/VCMetadata';
import {VPShareOverlayProps} from './VPShareOverlay';
import {ActivityLogEvents} from '../../machines/activityLog';
import {VPShareActivityLog} from '../../components/VPShareActivityLogEvent';

type MyVcsTabNavigation = NavigationProp<RootRouteProps>;

const changeTabBarVisible = (visible: string) => {
  Theme.BottomTabBarStyle.tabBarStyle.display = visible;
};

export function useSendVPScreen() {
  const {t} = useTranslation('SendVPScreen');
  const {appService} = useContext(GlobalContext);
  const scanService = appService.children.get('scan')!!;
  const vcMetaService = appService.children.get('vcMeta')!!;
  const activityLogService = appService.children.get('activityLog')!!;
  const navigation = useNavigation<MyVcsTabNavigation>();
  const openID4VPService = scanService.getSnapshot().context.OpenId4VPRef;
  const [selectedVCKeys, setSelectedVCKeys] = useState<Record<string, string>>(
    {},
  );
  const shareableVcs = useSelector(vcMetaService, selectShareableVcs);

  const myVcs = useSelector(vcMetaService, selectMyVcs);

  const isGetVCsSatisfyingAuthRequest = useSelector(
    openID4VPService,
    selectIsGetVCsSatisfyingAuthRequest,
  );

  if (isGetVCsSatisfyingAuthRequest) {
    openID4VPService.send('DOWNLOADED_VCS', {vcs: shareableVcs});
  }

  const areAllVCsChecked = useSelector(
    openID4VPService,
    selectAreAllVCsChecked,
  );
  const vcsMatchingAuthRequest = useSelector(
    openID4VPService,
    selectVCsMatchingAuthRequest,
  );

  const checkIfAnyVCHasImage = vcs => {
    const hasImage = Object.values(vcs)
      .flatMap(vc => vc)
      .some(vc => {
        return isMosipVC(vc.vcMetadata.issuer);
      });
    return hasImage;
  };

  const checkIfAllVCsHasImage = vcs => {
    const hasImage = Object.values(vcs)
      .flatMap(vc => vc)
      .every(vc => isMosipVC(vc.vcMetadata.issuer));
    return hasImage;
  };

  const getSelectedVCs = () => {
    var selectedVcsData = {};
    Object.entries(selectedVCKeys).map(([vcKey, inputDescriptorId]) => {
      const vcData = myVcs[vcKey];
      selectedVcsData[inputDescriptorId] ??= [];
      selectedVcsData[inputDescriptorId].push(vcData);
    });
    return selectedVcsData;
  };

  const showConfirmationPopup = useSelector(
    openID4VPService,
    selectShowConfirmationPopup,
  );
  const isSelectingVCs = useSelector(openID4VPService, selectIsSelectingVcs);
  const error = useSelector(openID4VPService, selectIsError);
  const isVPSharingConsent = useSelector(
    openID4VPService,
    selectIsGetVPSharingConsent,
  );
  const CONFIRM = () => openID4VPService.send(OpenID4VPEvents.CONFIRM());

  const CANCEL = () => openID4VPService.send(OpenID4VPEvents.CANCEL());

  const GO_BACK = () => openID4VPService.send(OpenID4VPEvents.GO_BACK());

  const DISMISS = () => scanService.send(ScanEvents.DISMISS());

  const DISMISS_POPUP = () =>
    openID4VPService.send(OpenID4VPEvents.DISMISS_POPUP());
  const openID4VPRetryCount = useSelector(
    openID4VPService,
    selectOpenID4VPRetryCount,
  );
  const noCredentialsMatchingVPRequest =
    isSelectingVCs && Object.keys(vcsMatchingAuthRequest).length === 0;
  let errorModal = {
    show: error !== '' || noCredentialsMatchingVPRequest,
    title: '',
    message: '',
    showRetryButton: false,
  };

  function generateAndStoreLogMessage(logType: string, errorInfo?: string) {
    activityLogService.send(
      ActivityLogEvents.LOG_ACTIVITY(
        VPShareActivityLog.getLogFromObject({
          timestamp: Date.now(),
          type: logType,
          info: errorInfo,
        }),
      ),
    );
  }
  const requestedClaimsByVerifier = useSelector(
    openID4VPService,
    selectRequestedClaimsByVerifier,
  );
  const claimsAsString = '[' + requestedClaimsByVerifier + ']';
  if (noCredentialsMatchingVPRequest) {
    errorModal.title = t('errors.noMatchingCredentials.title');
    errorModal.message = t('errors.noMatchingCredentials.message', {
      claims: claimsAsString,
    });
    generateAndStoreLogMessage(
      'NO_CREDENTIAL_MATCHING_REQUEST',
      claimsAsString,
    );
  } else if (
    error.includes('Verifier authentication was unsuccessful') ||
    error.startsWith('api error')
  ) {
    errorModal.title = t('errors.invalidVerifier.title');
    errorModal.message = t('errors.invalidVerifier.message');
    generateAndStoreLogMessage('VERIFIER_AUTHENTICATION_FAILED');
  } else if (error.includes('credential mismatch detected')) {
    errorModal.title = t('errors.credentialsMismatch.title');
    errorModal.message = t('errors.credentialsMismatch.message', {
      claims: claimsAsString,
    });
    generateAndStoreLogMessage(
      'CREDENTIAL_MISMATCH_FROM_KEBAB',
      claimsAsString,
    );
  } else if (error.includes('none of the selected VC has image')) {
    errorModal.title = t('errors.noImage.title');
    errorModal.message = t('errors.noImage.message');
    generateAndStoreLogMessage('NO_SELECTED_VC_HAS_IMAGE');
  } else if (error.startsWith('vc validation')) {
    errorModal.title = t('errors.invalidQrCode.title');
    errorModal.message = t('errors.invalidQrCode.message');
    generateAndStoreLogMessage('INVALID_AUTH_REQUEST');
  } else if (error.startsWith('send vp')) {
    errorModal.title = t('errors.genericError.title');
    errorModal.message = t('errors.genericError.message');
    errorModal.showRetryButton = true;
  } else if (error !== '') {
    errorModal.title = t('errors.genericError.title');
    errorModal.message = t('errors.genericError.message');
    generateAndStoreLogMessage('TECHNICAL_ERROR');
  }

  let overlayDetails: Omit<VPShareOverlayProps, 'isVisible'> | null = null;
  if (isVPSharingConsent) {
    overlayDetails = {
      primaryButtonTestID: 'confirm',
      primaryButtonText: t('consentDialog.confirmButton'),
      primaryButtonEvent: CONFIRM,
      secondaryButtonTestID: 'cancel',
      secondaryButtonText: t('consentDialog.cancelButton'),
      secondaryButtonEvent: CANCEL,
      title: t('consentDialog.title'),
      titleTestID: 'consentTitle',
      message: t('consentDialog.message'),
      messageTestID: 'consentMsg',
      onCancel: DISMISS_POPUP,
    };
  } else if (showConfirmationPopup) {
    overlayDetails = {
      primaryButtonTestID: 'yesProceed',
      primaryButtonText: t('confirmationDialog.confirmButton'),
      primaryButtonEvent: CONFIRM,
      secondaryButtonTestID: 'goBack',
      secondaryButtonText: t('confirmationDialog.cancelButton'),
      secondaryButtonEvent: GO_BACK,
      title: t('confirmationDialog.title'),
      titleTestID: 'confirmationTitle',
      message: t('confirmationDialog.message'),
      messageTestID: 'confirmationMsg',
      onCancel: DISMISS_POPUP,
    };
  }

  return {
    isSendingVP: useSelector(openID4VPService, selectIsSharingVP),
    showLoadingScreen: useSelector(openID4VPService, selectIsShowLoadingScreen),
    vpVerifierName: useSelector(
      openID4VPService,
      selectVerifierNameInVPSharing,
    ),
    flowType: useSelector(openID4VPService, selectFlowType),
    showConfirmationPopup,
    isSelectingVCs,
    checkIfAnyVCHasImage,
    checkIfAllVCsHasImage,
    getSelectedVCs,
    errorModal,
    overlayDetails,
    scanScreenError: useSelector(scanService, selectIsSendingVPError),
    vcsMatchingAuthRequest,
    userSelectedVCs: useSelector(openID4VPService, selectSelectedVCs),
    areAllVCsChecked,
    selectedVCKeys,
    isVerifyingIdentity: useSelector(
      openID4VPService,
      selectIsVerifyingIdentity,
    ),
    purpose: useSelector(openID4VPService, selectPurpose),
    isInvalidIdentity: useSelector(openID4VPService, selectIsInvalidIdentity),
    isCancelling: useSelector(scanService, selectIsCancelling),
    isFaceVerificationConsent: useSelector(
      openID4VPService,
      selectIsFaceVerificationConsent,
    ),
    credentials: useSelector(openID4VPService, selectCredentials),
    verifiableCredentialsData: useSelector(
      openID4VPService,
      selectVerifiableCredentialsData,
    ),
    FACE_VERIFICATION_CONSENT: (isDoNotAskAgainChecked: boolean) =>
      openID4VPService.send(
        OpenID4VPEvents.FACE_VERIFICATION_CONSENT(isDoNotAskAgainChecked),
      ),
    DISMISS,
    DISMISS_POPUP,
    RETRY: () => openID4VPService.send(OpenID4VPEvents.RETRY()),
    FACE_VALID: () => openID4VPService.send(OpenID4VPEvents.FACE_VALID()),
    FACE_INVALID: () => openID4VPService.send(OpenID4VPEvents.FACE_INVALID()),
    RETRY_VERIFICATION: () =>
      openID4VPService.send(OpenID4VPEvents.RETRY_VERIFICATION()),
    GO_TO_HOME: () => {
      navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'});
      scanService.send(ScanEvents.DISMISS());
      openID4VPService.send(OpenID4VPEvents.RESET_ERROR());
      changeTabBarVisible('flex');
    },
    SELECT_VC_ITEM:
      (vcKey: string, inputDescriptorId: string) =>
      (vcRef: ActorRefFrom<typeof VCItemMachine>) => {
        var selectedVcs = {...selectedVCKeys};
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
      openID4VPService.send(OpenID4VPEvents.ACCEPT_REQUEST(getSelectedVCs()));
    },

    VERIFY_AND_ACCEPT_REQUEST: () => {
      openID4VPService.send(
        OpenID4VPEvents.VERIFY_AND_ACCEPT_REQUEST(getSelectedVCs()),
      );
    },
    CANCEL,
    openID4VPRetryCount,
    RESET_RETRY_COUNT: () =>
      openID4VPService.send(OpenID4VPEvents.RESET_RETRY_COUNT()),
  };
}
