import {useSelector} from '@xstate/react';
import {
  selectSupportedCredentialTypes,
  selectErrorMessageType,
  selectIsBiometricCancelled,
  selectIsDone,
  selectIsDownloadCredentials,
  selectIsIdle,
  selectIssuers,
  selectIsError,
  selectLoadingReason,
  selectSelectedIssuer,
  selectSelectingCredentialType,
  selectStoring,
  selectVerificationErrorMessage,
  selectIsNonGenericError,
  selectIsQrScanning,
  selectCredentialOfferData,
} from '../../machines/Issuers/IssuersSelectors';
import {ActorRefFrom} from 'xstate';
import {BOTTOM_TAB_ROUTES} from '../../routes/routesConstants';
import {logState} from '../../shared/commonUtil';
import {isAndroid} from '../../shared/constants';
import {
  IssuerScreenTabEvents,
  IssuersMachine,
} from '../../machines/Issuers/IssuersMachine';
import {CredentialTypes} from '../../machines/VerifiableCredential/VCMetaMachine/vc';

export function useIssuerScreenController({route, navigation}) {
  const service = route.params.service;
  service.subscribe(logState);

  return {
    issuers: useSelector(service, selectIssuers),
    selectedIssuer: useSelector(service, selectSelectedIssuer),
    errorMessageType: useSelector(service, selectErrorMessageType),
    isDownloadingCredentials: useSelector(service, selectIsDownloadCredentials),
    isBiometricsCancelled: useSelector(service, selectIsBiometricCancelled),
    isDone: useSelector(service, selectIsDone),
    isIdle: useSelector(service, selectIsIdle),
    isNonGenericError: useSelector(service, selectIsNonGenericError),
    loadingReason: useSelector(service, selectLoadingReason),
    isStoring: useSelector(service, selectStoring),
    isQrScanning: useSelector(service, selectIsQrScanning),
    isSelectingCredentialType: useSelector(
      service,
      selectSelectingCredentialType,
    ),
    credentialOfferData: useSelector(service, selectCredentialOfferData),
    supportedCredentialTypes: useSelector(
      service,
      selectSupportedCredentialTypes,
    ),
    verificationErrorMessage: useSelector(
      service,
      selectVerificationErrorMessage,
    ),
    isError: useSelector(service, selectIsError),

    CANCEL: () => service.send(IssuerScreenTabEvents.CANCEL()),
    SELECTED_ISSUER: id =>
      service.send(IssuerScreenTabEvents.SELECTED_ISSUER(id)),
    TRY_AGAIN: () => service.send(IssuerScreenTabEvents.TRY_AGAIN()),
    RESET_ERROR: () => service.send(IssuerScreenTabEvents.RESET_ERROR()),
    DOWNLOAD_ID: () => {
      service.send(IssuerScreenTabEvents.DOWNLOAD_ID());
      navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'});
    },
    SELECTED_CREDENTIAL_TYPE: (credType: CredentialTypes) =>
      service.send(IssuerScreenTabEvents.SELECTED_CREDENTIAL_TYPE(credType)),
    QR_CODE_SCANNED: (qrData: string) => {
      service.send(IssuerScreenTabEvents.QR_CODE_SCANNED(qrData));
    },
    RESET_VERIFY_ERROR: () => {
      service.send(IssuerScreenTabEvents.RESET_VERIFY_ERROR());
      if (isAndroid()) {
        navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'});
      } else {
        setTimeout(
          () =>
            navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'}),
          0,
        );
      }
    },
    SCAN_CREDENTIAL_OFFER_QR_CODE: () => {
      service.send(IssuerScreenTabEvents.SCAN_CREDENTIAL_OFFER_QR_CODE());
    },
    SELECTED_CREDENTIAL_OFFER_ISSUER: (id: string) => {
      service.send(IssuerScreenTabEvents.SELECTED_CREDENTIAL_OFFER_ISSUER(id));
    },
  };
}

export interface IssuerModalProps {
  service?: ActorRefFrom<typeof IssuersMachine>;
  onPress?: () => void;
  isVisible?: boolean;
}
