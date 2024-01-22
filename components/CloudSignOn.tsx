import React, {useEffect} from 'react';
import {Button, Platform, Pressable} from 'react-native';
import {CloudStorage} from 'react-native-cloud-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {GOOGLE_ANDROID_CLIENT_ID} from 'react-native-dotenv';

WebBrowser.maybeCompleteAuthSession();

// This component needs to be modified as the token is received and may need to move these logic to backup screen
export const CloudSignOn: React.FC = props => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/drive.appdata'],
  });

  useEffect(() => {
    if (response.type == 'success') {
      console.log('acc tkn :: ', response.authentication.accessToken);
      //set the token
    }
  });
  return (
    <Button
      type="gradient"
      title={'Google Sign-In'}
      onPress={() => {
        console.log('hello world');
        CloudStorage.isCloudAvailable().then(value => {
          if (value) {
            console.log('we are good');
          } else {
            if (Platform.OS == 'android') {
              promptAsync();
            }
            if (Platform.OS == 'ios') {
              //ask to sign in into  to icloud
            }
          }
        });
      }}
    />
  );
};
