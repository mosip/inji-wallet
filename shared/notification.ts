import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {Alert, Clipboard} from 'react-native';
import {useEffect} from 'react';
import {useMachine} from '@xstate/react';
import {IssuersMachine} from '/home/rashmi/data/repos/apps/ooru/credissuer-wallet/machines/Issuers/IssuersMachine.ts';

// Request notification permissions
export async function requestPermission(): Promise<void> {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted.');
  }
}

// Extract uppercase alphanumeric code from message
export function extractCode(message: string): string | null {
  const match = message.match(/\b[A-Z0-9]{10,}\b/);
  return match ? match[0] : null;
}

// Handle foreground notifications
export function useForegroundNotification(): void {
  const [state, send] = useMachine(IssuersMachine);

  useEffect(() => {
    requestPermission(); // Ensure permission request happens dynamically

    const unsubscribe = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        const {title, body} = remoteMessage.notification || {};
        const messageText = body || 'You have received a new message.';
        const credential_issuer = remoteMessage.data || {};

        // Extract org_code safely
        const issuerId = credential_issuer.org_code || null;

        console.log('Extracted org_code:', issuerId); // Log extracted org_code

        const codeToCopy = extractCode(messageText);
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', credential_issuer);
        const handleCopy = async () => {
          if (codeToCopy && credential_issuer) {
            Clipboard.setString(codeToCopy);
            Alert.alert('Copied', `Code copied: ${codeToCopy}`);
            send({type: 'SELECTED_ISSUER', data: {org_code: issuerId}});
          } else {
            Alert.alert(
              'No Code',
              'No valid code or credential issuer found in the message.',
            );
          }
        };

        Alert.alert(title || 'New Notification', messageText, [
          {text: 'Copy Code', onPress: handleCopy},
          {text: 'Cancel', style: 'cancel'},
        ]);
      },
    );
    return unsubscribe;
  }, [state]); // Re-register on state changes
}

// Handle background notifications
export function useBackgroundNotification(): void {
  useEffect(() => {
    requestPermission(); // Ensure permission request happens dynamically

    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log(
          'Notification opened in background/quit state:',
          remoteMessage.notification?.body,
        );
        Alert.alert(
          'Notification',
          remoteMessage.notification?.body ||
            'You have received a new notification.',
        );
      },
    );

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification received while app was quit:',
            remoteMessage.notification?.body,
          );
          Alert.alert(
            remoteMessage.notification?.title || 'Notification',
            remoteMessage.notification?.body ||
              'You have received a new notification.',
          );
        }
      })
      .catch(error => {
        console.log('Error getting initial notification:', error);
      });

    messaging().setBackgroundMessageHandler(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log(
          'Background message received:',
          remoteMessage.notification?.body,
        );
        Alert.alert(
          'Background Notification',
          remoteMessage.notification?.body ||
            'You have received a new message.',
        );
      },
    );

    return () => {
      unsubscribeBackground();
    };
  }, []); // Runs only once but ensures permission request dynamically
}
