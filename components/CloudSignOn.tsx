import React, {useEffect} from 'react';
import {Button, Platform, Pressable} from 'react-native';
import {CloudStorage} from 'react-native-cloud-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {GOOGLE_ANDROID_CLIENT_ID} from 'react-native-dotenv';

WebBrowser.maybeCompleteAuthSession();

// This component needs to be modified as the token is received and may need to move these logic to backup screen
export const CloudSignOn: React.FC<CloudSignOnProps> = props => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/drive.appdata'],
  });

  useEffect(() => {
    if (response.type == 'success') {
      CloudStorage.setGoogleDriveAccessToken(
        response.authentication.accessToken,
      );
    }
  });
  return (
    <Button
      type="gradient"
      title={props.title}
      onPress={() => {
        CloudStorage.isCloudAvailable().then(value => {
          if (!value) {
            if (Platform.OS == 'android') {
              promptAsync();
            }
            if (Platform.OS == 'ios') {
              //todo: ask to sign in into  to icloud
            }
          }
        });
      }}
      margin={[0, 0, 0, 0]}
    />
  );
};

export interface CloudSignOnProps {
  title: string;
}
