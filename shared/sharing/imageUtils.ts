import RNShare, {ShareOptions} from 'react-native-share';

export async function shareImageToAllSupportedApps(
  sharingOptions: ShareOptions,
): Promise<Boolean> {
  try {
    const shareStatusResult = await RNShare.open(sharingOptions);
    return shareStatusResult['success'];
  } catch (err) {
    console.error('Exception while sharing image::', err);
    return false;
  }
}
