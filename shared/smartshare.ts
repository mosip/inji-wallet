// TODO: fix export from smartshare library
// import {
//   IdpassSmartshare,
//   GoogleNearbyMessages,
// } from '@idpass/smartshare-react-native';
import Smartshare from '@idpass/smartshare-react-native';
const { IdpassSmartshare, GoogleNearbyMessages } = Smartshare;

import { Message } from './Message';

export function gnmSubscribe<T>(
  messageType: string,
  callback: (data: T) => void
) {
  return GoogleNearbyMessages.subscribe(
    (foundMessage) => {
      if (__DEV__) {
        console.log('\n[request] MESSAGE_FOUND', foundMessage);
      }

      const message = Message.fromString<T>(foundMessage);
      if (message.type === messageType) {
        GoogleNearbyMessages.unsubscribe();
        callback(message.data);
      }
    },
    (lostMessage) => {
      if (__DEV__) {
        console.log('\n[request] MESSAGE_LOST', lostMessage);
      }
    }
  );
}

export function issSubscribe<T>(
  messageType: string,
  callback: (data: T) => void
) {
  return IdpassSmartshare.handleNearbyEvents((event) => {
    if (event.type !== 'msg') return;

    const response = Message.fromString<T>(event.data);
    if (response.type === messageType) {
      callback(response.data);
    }
  });
}
