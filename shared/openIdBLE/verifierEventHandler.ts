// TODO: fix export from smartshare library
// import {
//   IdpassSmartshare,
//   GoogleNearbyMessages,
// } from '@idpass/smartshare-react-native';
import openIdBLE from 'react-native-openid4vp-ble';
import {
  SmartshareEvent,
  SmartshareEventData,
  SmartshareEvents,
  SmartshareEventType,
} from './smartshareEvent';

const { verifier } = openIdBLE;

export function offlineSubscribe<T extends SmartshareEventType>(
  eventType: T,
  callback: (data: SmartshareEventData<T>) => void
) {
  return verifier.handleNearbyEvents(({ type, data }) => {
    if (type !== 'msg') return;

    const response = SmartshareEvent.fromString<T>(data);
    if (response.type === eventType) {
      callback(response.data);
    }
  });
}

export function offlineSend(event: SmartshareEvents, callback: () => void) {
  verifier.send(
    new SmartshareEvent(event.type, event.data).toString(),
    callback
  );
}
