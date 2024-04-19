import {isSignedInResult} from '../../shared/CloudBackupAndRestoreUtils';
import {ErrorMessage, Issuers, OIDCErrors} from '../../shared/openId4VCI/Utils';
import {isHardwareKeystoreExists} from '../../shared/cryptoutil/cryptoUtil';
import {BiometricCancellationError} from '../../shared/error/BiometricCancellationError';

export const IssuersGuards = () => {
  return {
    isSignedIn: (_: any, event: any) =>
      (event.data as isSignedInResult).isSignedIn,
    hasKeyPair: (context: any) => !!context.publicKey,
    isMultipleCredentialsSupported: (context: any, event: any) =>
      event.data.supportedCredentials.length > 1 &&
      context.selectedIssuer.credential_issuer === Issuers.Sunbird,
    isInternetConnected: (_: any, event: any) => !!event.data.isConnected,
    isOIDCflowCancelled: (_: any, event: any) => {
      // iOS & Android have different error strings for user cancelled flow
      const err = [
        OIDCErrors.OIDC_FLOW_CANCELLED_ANDROID,
        OIDCErrors.OIDC_FLOW_CANCELLED_IOS,
      ];
      return (
        !!event.data &&
        typeof event.data.toString === 'function' &&
        err.some(e => event.data.toString().includes(e))
      );
    },
    isOIDCConfigError: (_: any, event: any) => {
      return (
        !!event.data &&
        typeof event.data.toString === 'function' &&
        event.data.toString().includes(OIDCErrors.OIDC_CONFIG_ERROR_PREFIX)
      );
    },
    canSelectIssuerAgain: (context: any) => {
      return (
        context.errorMessage.includes(OIDCErrors.OIDC_CONFIG_ERROR_PREFIX) ||
        context.errorMessage.includes(ErrorMessage.REQUEST_TIMEDOUT)
      );
    },
    shouldFetchIssuersAgain: (context: any) => context.issuers.length === 0,
    isCustomSecureKeystore: () => isHardwareKeystoreExists,
    hasUserCancelledBiometric: (_: any, event: any) =>
      event.data instanceof BiometricCancellationError,
  };
};
