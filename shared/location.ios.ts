export function checkLocation(onEnabled: () => void) {
  onEnabled(); // iOS does not need location enabled
}

export function requestLocation() {
  // pass
}
