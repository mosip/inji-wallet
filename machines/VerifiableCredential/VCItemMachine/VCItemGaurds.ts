import {isSignedInResult} from '../../../shared/CloudBackupAndRestoreUtils';
import {isHardwareKeystoreExists} from '../../../shared/cryptoutil/cryptoUtil';

export const VCItemGaurds = () => {
  return {
    hasCredential: (_, event) => {
      const vc = event.response;
      return vc?.credential != null || vc?.verifiableCredential != null;
    },
    isSignedIn: (_context, event) =>
      (event.data as isSignedInResult).isSignedIn,

    isDownloadAllowed: _context => {
      return _context.downloadCounter <= _context.maxDownloadCount;
    },

    isCustomSecureKeystore: () => isHardwareKeystoreExists,
  };
};
