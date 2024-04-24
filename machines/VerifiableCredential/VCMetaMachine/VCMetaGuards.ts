import {isSignedInResult} from '../../../shared/CloudBackupAndRestoreUtils';

export const VCMetaGuards = () => {
  return {
    isSignedIn: (_context, event) =>
      (event.data as isSignedInResult).isSignedIn,
    isAnyVcTampered: context => {
      return context.tamperedVcs.length > 0;
    },
  };
};
