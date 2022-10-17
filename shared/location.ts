import LocationEnabler from 'react-native-location-enabler';

const LOCATION_CONFIG = {
  priority: LocationEnabler.PRIORITIES.BALANCED_POWER_ACCURACY,
  alwaysShow: false,
  needBle: true,
};

export function checkLocation(onEnabled: () => void, onDisabled: () => void) {
  const subscription = LocationEnabler.addListener(({ locationEnabled }) => {
    locationEnabled ? onEnabled() : onDisabled();
  });
  LocationEnabler.checkSettings(LOCATION_CONFIG);
  return subscription;
}

export function requestLocation() {
  return LocationEnabler.requestResolutionSettings(LOCATION_CONFIG);
}
