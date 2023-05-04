import openIdBLE from 'react-native-openid4vp-ble';
import {
  SmartshareEvent,
  SmartshareEventData,
  SmartshareEvents,
  SmartshareEventType,
} from './smartshareEvent';

const { wallet } = openIdBLE;

export function offlineSubscribe<T extends SmartshareEventType>(
  eventType: T,
  callback: (data: SmartshareEventData<T>) => void
) {
  return wallet.handleNearbyEvents(({ type, data }) => {
    if (type !== 'msg') return;

    const response = SmartshareEvent.fromString<T>(data);
    if (response.type === eventType) {
      callback(response.data);
    }
  });
}

export function offlineSend(event: SmartshareEvents, callback: () => void) {
  wallet.send(new SmartshareEvent(event.type, event.data).toString(), callback);
}
