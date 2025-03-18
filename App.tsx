import React, {useContext, useEffect} from 'react';
import {AppLayout} from './screens/AppLayout';
import {useFont} from './shared/hooks/useFont';
import {GlobalContextProvider} from './components/GlobalContextProvider';
import {GlobalContext} from './shared/GlobalContext';
import {useSelector} from '@xstate/react';
import {useTranslation} from 'react-i18next';
import {
  APP_EVENTS,
  selectIsDecryptError,
  selectIsKeyInvalidateError,
  selectIsReadError,
  selectIsReady,
} from './machines/app';
import {DualMessageOverlay} from './components/DualMessageOverlay';
import {useApp} from './screens/AppController';
import {Alert, AppState, Linking, Clipboard} from 'react-native';
import {
  configureTelemetry,
  getErrorEventData,
  sendErrorEvent,
} from './shared/telemetry/TelemetryUtils';
import {TelemetryConstants} from './shared/telemetry/TelemetryConstants';
import {MessageOverlay} from './components/MessageOverlay';
import {NativeModules} from 'react-native';
import {isHardwareKeystoreExists} from './shared/cryptoutil/cryptoUtil';
import i18n from './i18n';
import './shared/flipperConfig';
import {CopilotProvider} from 'react-native-copilot';
import {CopilotTooltip} from './components/CopilotTooltip';
import {Theme} from './components/ui/styleUtils';
import messaging from '@react-native-firebase/messaging';
const {RNSecureKeystoreModule} = NativeModules;

const DecryptErrorAlert = (controller, t) => {
  const heading = t('errors.decryptionFailed');
  const desc = t('errors.decryptionFailed');
  const ignoreBtnTxt = t('ignore');
  Alert.alert(heading, desc, [
    {
      text: ignoreBtnTxt,
      onPress: () => controller.ignoreDecrypt(),
      style: 'cancel',
    },
  ]);
};

const AppLayoutWrapper: React.FC = () => {
  const {appService} = useContext(GlobalContext);
  const isDecryptError = useSelector(appService, selectIsDecryptError);
  const controller = useApp();
  const {t} = useTranslation('WelcomeScreen');

  useEffect(() => {
    if (AppState.currentState === 'active') {
      appService.send(APP_EVENTS.ACTIVE());
    } else {
      appService.send(APP_EVENTS.INACTIVE());
    }
  }, []);

  if (isDecryptError) {
    DecryptErrorAlert(controller, t);
  }
  configureTelemetry();
  return <AppLayout />;
};

const AppInitialization: React.FC = () => {
  const {appService} = useContext(GlobalContext);
  const isReady = useSelector(appService, selectIsReady);
  const hasFontsLoaded = useFont();
  const {t} = useTranslation('common');

  useEffect(() => {
    if (isHardwareKeystoreExists) {
      RNSecureKeystoreModule.updatePopup(
        t('biometricPopup.title'),
        t('biometricPopup.description'),
      );
    }

    // Request permission for notifications
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted.');
      }
    };

    // Function to extract a single uppercase alphanumeric code (e.g., A4WTDHDFDET)
    const extractCode = message => {
      const match = message.match(/\b[A-Z0-9]{10,}\b/); // Looks for 10+ character uppercase alphanumeric sequences
      return match ? match[0] : null;
    };

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      const {title, body} = remoteMessage.notification || {};
      const messageText = body || 'You have received a new message.';

      const {org_code} = remoteMessage.data || {}; // Extract org_name from backend data
      const codeToCopy = extractCode(messageText); // Extract only the required code

      const handleCopyAndOpenURL = async () => {
        if (codeToCopy && org_code) {
          Clipboard.setString(codeToCopy);
          Alert.alert('Copied', `Code copied: ${codeToCopy}`);

          try {
            // Call the API using the extracted org_code
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', org_code);
            const fetchIssuerConfig = async (issuerId: string) => {
              const url = issuerWellknownConfig.buildURL(issuerId);
              const response = await fetch(url, {
                method: issuerWellknownConfig.method,
              });
              return response.json();
            };

            // Open the eSignet portal URL
            const esignetUrl =
              'https://staging-opt.credissuer.com/login?nonce=pa_fAWkGKKAqyZQMU0z_8A&state=Dp1QPsG43h_qdQwfhEJBww#eyJ0cmFuc2FjdGlvbklkIjoiUWJTV0lXRTFRQnBwcTkxMnpUMFBZRG1vU2tJYWZ0dDFTdVJEcHVlcTduZyIsImxvZ29VcmwiOiJodHRwczovL2NyZWRpc3N1ZXItcHVibGljLWFzc2V0cy5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20vY3JlZGlzc3Vlcl9sb2dvLnBuZyIsImF1dGhGYWN0b3JzIjpbW3sidHlwZSI6Ik9UUCIsImNvdW50IjowLCJzdWJUeXBlcyI6bnVsbH1dXSwiYXV0aG9yaXplU2NvcGVzIjpbXSwiZXNzZW50aWFsQ2xhaW1zIjpbXSwidm9sdW50YXJ5Q2xhaW1zIjpbXSwiY29uZmlncyI6eyJzYmkuZW52IjoiRGV2ZWxvcGVyIiwic2JpLnRpbWVvdXQuRElTQyI6MzAsInNiaS50aW1lb3V0LkRJTkZPIjozMCwic2JpLnRpbWVvdXQuQ0FQVFVSRSI6MzAsInNiaS5jYXB0dXJlLmNvdW50LmZhY2UiOjEsInNiaS5jYXB0dXJlLmNvdW50LmZpbmdlciI6MSwic2JpLmNhcHR1cmUuY291bnQuaXJpcyI6MSwic2JpLmNhcHR1cmUuc2NvcmUuZmFjZSI6NzAsInNiaS5jYXB0dXJlLnNjb3JlLmZpbmdlciI6NzAsInNiaS5jYXB0dXJlLnNjb3JlLmlyaXMiOjcwLCJyZXNlbmQub3RwLmRlbGF5LnNlY3MiOjEyMCwic2VuZC5vdHAuY2hhbm5lbHMiOiJlbWFpbCxwaG9uZSIsImNhcHRjaGEuc2l0ZWtleSI6InNpdGVrZXkiLCJjYXB0Y2hhLmVuYWJsZSI6IiIsImF1dGgudHhuaWQubGVuZ3RoIjoiMTAiLCJjb25zZW50LnNjcmVlbi50aW1lb3V0LWluLXNlY3MiOjYwMCwiY29uc2VudC5zY3JlZW4udGltZW91dC1idWZmZXItaW4tc2VjcyI6NSwibGlua2VkLXRyYW5zYWN0aW9uLWV4cGlyZS1pbi1zZWNzIjoxMjAsInNiaS5wb3J0LnJhbmdlIjotOTksInNiaS5iaW8uc3VidHlwZXMuaXJpcyI6IlVOS05PV04iLCJzYmkuYmlvLnN1YnR5cGVzLmZpbmdlciI6IlVOS05PV04iLCJ3YWxsZXQucXItY29kZS1idWZmZXItaW4tc2VjcyI6MTAsIm90cC5sZW5ndGgiOjYsInBhc3N3b3JkLnJlZ2V4IjoiIiwid2FsbGV0LmNvbmZpZyI6W10sImF1dGguZmFjdG9yLmtiYS5pbmRpdmlkdWFsLWlkLWZpZWxkIjoiIiwiYXV0aC5mYWN0b3Iua2JhLmZpZWxkLWRldGFpbHMiOltdfSwicmVkaXJlY3RVcmkiOiJpby5tb3NpcC5yZXNpZGVudGFwcC5pbmppOi8vb2F1dGhyZWRpcmVjdCIsImNsaWVudE5hbWUiOnsiQG5vbmUiOiJQZW5zaW9uIFNjaGVtZSJ9LCJjcmVkZW50aWFsU2NvcGVzIjpbIm1vY2tfaWRlbnRpdHlfdmNfbGRwIl19';

            Linking.openURL(esignetUrl).catch(err =>
              console.error('Failed to open URL:', err),
            );
          } catch (error) {
            console.error('Failed to call API:', error);
            Alert.alert('Error', 'Failed to communicate with the server.');
          }
        } else {
          Alert.alert(
            'No Code',
            'No valid code or organization name found in the message.',
          );
        }
      };

      Alert.alert(title || 'New Notification', messageText, [
        {text: 'Copy Code & Open eSignet', onPress: handleCopyAndOpenURL},
        {text: 'Cancel', style: 'cancel'},
      ]);
    });

    // Handle notification clicks in background or quit state
    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          'Notification opened in background/quit state:',
          remoteMessage.notification.body,
        );
        // Show an alert when notification is clicked
        Alert.alert(
          'Notification',
          remoteMessage.notification.body ||
            'You have received a new notification.',
        );
      },
    );

    // Handle notification clicks when the app is in quit state (app is terminated)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification received while app was quit:',
            remoteMessage.notification.body,
          );
          // Show an alert when notification is clicked
          Alert.alert(
            remoteMessage.notification.title,
            remoteMessage.notification.body ||
              'You have received a new notification.',
          );
        } else {
          console.log('No initial notification found');
        }
      })
      .catch(error => {
        console.log('Error getting initial notification:', error);
      });
    // Handle background messages (app is in the background or terminated)
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log(
        'Background message received:',
        remoteMessage.notification.body,
      );
      // Show an alert when notification is received in the background
      Alert.alert(
        'Background Notification',
        remoteMessage.notification.body || 'You have received a new message.',
      );
    });

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, [i18n.language]);

  return isReady && hasFontsLoaded ? (
    <AppLayoutWrapper />
  ) : (
    <MessageOverlay
      isVisible={!isReady}
      title={t('loading')}
      message={t('pleaseWait')}
    />
  );
};

export default function App() {
  return (
    <GlobalContextProvider>
      <CopilotProvider
        stopOnOutsideClick
        androidStatusBarVisible
        tooltipComponent={CopilotTooltip}
        tooltipStyle={Theme.Styles.copilotStyle}
        stepNumberComponent={() => null}
        animated>
        <AppInitialization />
      </CopilotProvider>
    </GlobalContextProvider>
  );
}
