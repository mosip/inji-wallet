import Cloud from '../../../shared/CloudBackupAndRestoreUtils';

export const VCMetaServices = () => {
  return {
    isUserSignedAlready: () => async () => {
      return await Cloud.isSignedInAlready();
    },
  };
};
