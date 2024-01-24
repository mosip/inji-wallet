import * as Google from 'expo-auth-session/providers/google';
import React, {useEffect, useState} from 'react';
import {Image, Platform, View} from 'react-native';
import {CloudStorage} from 'react-native-cloud-storage';
import {GOOGLE_ANDROID_CLIENT_ID} from 'react-native-dotenv';
import {Icon, ListItem} from 'react-native-elements';
import {
  Button,
  Centered,
  Column,
  HorizontallyCentered,
  Row,
  Text,
} from '../../components/ui';
import {LoaderAnimation} from '../../components/ui/LoaderAnimation';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {SvgImage} from '../../components/ui/svg';
import {request as apiRequest} from '../../shared/request';
import {useBackupScreen} from './BackupController';

const SectionLayout: React.FC<SectionLayoutProps> = ({
  headerIcon,
  headerText,
  children,
}) => {
  return (
    <View
      style={{
        marginLeft: 18,
        marginRight: 18,
        marginTop: 16,
        rowGap: 2,
      }}>
      <Row
        style={{
          alignItems: 'center',
          padding: 16,
          backgroundColor: Theme.Colors.whiteBackgroundColor,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
        }}>
        {headerIcon}
        <Text
          style={{
            justifyContent: 'center',
            paddingLeft: 12,
            fontFamily: 'Inter',
            fontWeight: '600',
            fontSize: 14,
          }}>
          {headerText}
        </Text>
        <ListItem.Subtitle></ListItem.Subtitle>
      </Row>
      <Row
        style={{
          padding: 16,
          backgroundColor: Theme.Colors.whiteBackgroundColor,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
        }}>
        <Column>{children}</Column>
      </Row>
    </View>
  );
};

type SectionLayoutProps = {
  headerIcon?: React.ReactNode;
  headerText: string;
  children: React.ReactNode;
};

const AccountInformation: React.FC<ProfileInfo> = ({email, picture}) => {
  return (
    <Row style={{marginBottom: 21, columnGap: 11}}>
      <Column align="center">
        <Image
          style={{height: 40, width: 40, borderRadius: 45}}
          source={{
            uri: picture,
          }}
        />
      </Column>
      <Column>
        <Row>
          <Text style={{color: Theme.Colors.helpText, fontSize: 12}}>
            Associated account
          </Text>
        </Row>
        <Row>
          <Text style={{fontSize: 13, fontFamily: 'Helvetica Neue'}}>
            {email}
          </Text>
        </Row>
      </Column>
    </Row>
  );
};

type ProfileInfo = {
  email: string;
  picture: string;
};

const BackupAndRestoreScreen = props => {
  const controller = useBackupScreen();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/drive.appdata'],
  });
  const [profileInfo, setProfileInfo] = useState(null);
  const [authenticationResponseType, setAuthenticationResponseType] = useState<
    null | 'cancel' | 'dismiss' | 'opened' | 'locked' | 'success'
  >(null);

  useEffect(() => {
    //TODO: Check right logic to trigger signin
    if (request && authenticationResponseType === null) {
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
    }
  }, [request]);

  useEffect(() => {
    extractUserInfo();
  }, [response]);

  const extractUserInfo: () => Promise<void> = async () => {
    if (response)
      console.log('response google signin ', JSON.stringify(response, null, 2));
    if (response?.type == 'success') {
      CloudStorage.setGoogleDriveAccessToken(
        response?.authentication?.accessToken,
      );
      const profileResponse = await apiRequest(
        'GET',
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${response.authentication?.accessToken}`,
        undefined,
        '',
      );
      setProfileInfo({
        email: profileResponse.email,
        picture: profileResponse.picture,
      });
      setAuthenticationResponseType(response.type);
    } else if (response?.type === 'dismiss') {
      setAuthenticationResponseType(response.type);
    }
  };

  const LastBackupSection = (
    <SectionLayout
      headerText={'Last Backup: No Backup Found'}
      headerIcon={SvgImage.DataBackupIcon(34, 24)}>
      <Row>
        <View style={{marginBottom: 19}}>
          <Text
            style={{
              fontFamily: 'Inter',
              fontWeight: 'normal',
              fontSize: 14,
              color: Theme.Colors.helpText,
            }}>
            Backup your Data to Google Drive. You can restore them when you
            reinstall INJI.
          </Text>
        </View>
      </Row>
      <Row style={{marginLeft: 4, marginRight: 4}}>
        {/* TODO: Button is not occupying the space in larger screens */}
        <Button
          testID="backup"
          type="gradient"
          title={'Backup'}
          onPress={controller.DATA_BACKUP}
          styles={{...Theme.MessageOverlayStyles.button, flex: 1}}
        />
      </Row>
    </SectionLayout>
  );

  const AccountSection = (
    <SectionLayout
      headerText={'Google Drive'}
      headerIcon={SvgImage.GoogleDriveIcon(28, 25)}>
      <View style={{marginBottom: 19}}>
        <Text
          style={{
            fontFamily: 'Inter',
            fontWeight: 'normal',
            fontSize: 14,
            color: Theme.Colors.helpText,
          }}>
          The backup will be stored in the Google Drive associated to your
          chosen gmail account.
        </Text>
      </View>
      <AccountInformation
        email={profileInfo?.email}
        picture={profileInfo?.picture}
      />
    </SectionLayout>
  );

  const RestoreSection = (
    <SectionLayout
      headerText="Restore"
      headerIcon={
        <Icon
          name="restore"
          type="MaterialIcons"
          size={30}
          color={Theme.Colors.Icon}
        />
      }>
      <Row style={{marginLeft: 4, marginRight: 4}}>
        <Button
          testID="backup"
          type="outline"
          title={'Restore'}
          onPress={() => {}}
          styles={{...Theme.MessageOverlayStyles.button, marginTop: 10}}
        />
      </Row>
    </SectionLayout>
  );

  return (
    <Modal
      isVisible
      headerTitle={'Backup & Restore'}
      headerElevation={2}
      arrowLeft={true}
      onDismiss={props.onBackPress}>
      <View
        style={{
          backgroundColor: Theme.Colors.lightGreyBackgroundColor,
          flex: 1,
        }}>
        {authenticationResponseType === 'success' ? (
          <React.Fragment>
            {LastBackupSection}
            {AccountSection}
            {RestoreSection}
          </React.Fragment>
        ) : (
          <HorizontallyCentered>
            <Centered>
              <LoaderAnimation />
            </Centered>
          </HorizontallyCentered>
        )}
      </View>
    </Modal>
  );
};

export default BackupAndRestoreScreen;
