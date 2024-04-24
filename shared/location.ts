import RNLocation from 'react-native-location';
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
    .catch(err => console.error('Error getting location:', err));
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
    console.error('Error while requesting location permission', error);
  }
}
