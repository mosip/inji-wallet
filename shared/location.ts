import RNLocation from 'react-native-location';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import i18n from '../i18n';
// Initialize RNLocation
RNLocation.configure({
  distanceFilter: 5.0, // Example configuration, adjust as needed
});

export function checkLocationPermissionStatus(
  onEnabled: () => void,
  onDisabled: () => void,
) {
  RNLocation.checkPermission({
    android: {
      detail: 'fine',
    },
  })
    .then(granted => {
      if (granted) {
        return onEnabled();
      } else {
        return onDisabled();
      }
    })
    .catch(err => console.log('Error getting location:', err));
}

export async function requestLocationPermission(
  onEnabled: () => void,
  onDisabled: () => void,
) {
  try {
    const granted = await RNLocation.requestPermission({
      android: {
        detail: 'fine',
      },
    });
    if (granted) {
      return onEnabled();
    } else {
      return onDisabled();
    }
  } catch (error) {
    console.log(error);
  }
}

export async function checkLocationService(
  onEnabled: () => void,
  onDisabled: () => void,
) {
  try {
    const config = {
      message: i18n.t('ScanScreen:errors:locationDisabled:message'),
      ok: i18n.t('common:ok'),
      cancel: i18n.t('common:dismiss'),
      enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true, // false => Directly catch method is called if location services are turned off
      preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
      preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
      providerListener: true, // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
    };
    await LocationServicesDialogBox.checkLocationServicesIsEnabled(config);
    onEnabled();
  } catch (e) {
    onDisabled();
  }
}
