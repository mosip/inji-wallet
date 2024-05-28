import RNShare, {ShareOptions} from 'react-native-share';

export async function shareImageToAllSupportedApps(
  sharingOptions: ShareOptions,
): Promise<Boolean> {
  try {
    const shareStatusResult = await RNShare.open(sharingOptions);
    console.log('Image shared suuccessfully::');
    return shareStatusResult['success'];
  } catch (err) {
    console.log('Exception while sharing Image::', err);
    return false;
  }
}
