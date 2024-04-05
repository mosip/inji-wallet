import {isSignedInResult} from '../../shared/CloudBackupAndRestoreUtils';
import {ErrorMessage, OIDCErrors} from '../../shared/openId4VCI/Utils';
import {isHardwareKeystoreExists} from '../../shared/cryptoutil/cryptoUtil';
import {BiometricCancellationError} from '../../shared/error/BiometricCancellationError';

export const IssuersGuards = () => {
  return {
    isSignedIn: (_context, event) =>
      (event.data as isSignedInResult).isSignedIn,
    hasKeyPair: context => !!context.publicKey,
    isMultipleCredentialsSupported: (_, event) =>
      event.data.supportedCredentials.length > 2,
    isInternetConnected: (_, event) => !!event.data.isConnected,
    isOIDCflowCancelled: (_, event) => {
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
    isOIDCConfigError: (_, event) => {
      return (
        !!event.data &&
        typeof event.data.toString === 'function' &&
        event.data.toString().includes(OIDCErrors.OIDC_CONFIG_ERROR_PREFIX)
      );
    },
    canSelectIssuerAgain: (context, _) => {
      return (
        context.errorMessage.includes(OIDCErrors.OIDC_CONFIG_ERROR_PREFIX) ||
        context.errorMessage.includes(ErrorMessage.REQUEST_TIMEDOUT)
      );
    },
    shouldFetchIssuersAgain: context => context.issuers.length === 0,
    isCustomSecureKeystore: () => isHardwareKeystoreExists,
    hasUserCancelledBiometric: (_, event) =>
      event.data instanceof BiometricCancellationError,
  };
};
