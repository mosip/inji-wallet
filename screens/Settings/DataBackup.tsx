import React, {useState} from 'react';
import {Pressable} from 'react-native';
import {ListItem} from 'react-native-elements';
import {Row, Text} from '../../components/ui';
import {Error} from '../../components/ui/Error';
import {LoaderAnimation} from '../../components/ui/LoaderAnimation';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {SvgImage} from '../../components/ui/svg';
import Cloud, {
  ProfileInfo,
  SignInResult,
  isSignedInResult,
} from '../../shared/googleCloudUtils';
import {AccountSelection} from './AccountSelection';
import BackupAndRestoreScreen from './BackupAndRestoreScreen';
import {useBackupScreen} from './BackupController';

export const DataBackup: React.FC = ({} = () => {
  const controller = useBackupScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectingAccount, setIsSelectingAccount] = useState(false);
  //TODO: rename to showAccountSelection
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showBackAndRestoreScreen, setShowBackAndRestoreScreen] =
    useState(false);

  const [profileInfo, setProfileInfo] = useState<ProfileInfo | undefined>();

  // TODO : Check if the setup is already done

  const [authenticationResponseType, setAuthenticationResponseType] = useState<
    keyof typeof Cloud.status | null
  >(null);

  const handleBackupAndRestore = async () => {
    setIsLoading(true);
    const result: isSignedInResult = await Cloud.isSignedInAlready();
    if (result.isSignedIn) {
      setProfileInfo(result.profileInfo);
      setShowBackAndRestoreScreen(true);
    } else {
      setShowConfirmation(true);
    }
    setIsLoading(false);
  };

  const handleAccountSelection = async () => {
    setIsSelectingAccount(true);
    setAuthenticationResponseType(null);
    setShowBackAndRestoreScreen(true);
    const result: SignInResult = await Cloud.signIn();
    if (result.status == Cloud.status.SUCCESS) {
      setProfileInfo(result.profileInfo);
    }
    setAuthenticationResponseType(result.status);
    setIsSelectingAccount(false);
  };

  return (
    <React.Fragment>
      <Pressable onPress={handleBackupAndRestore}>
        <ListItem topDivider bottomDivider>
          {SvgImage.DataBackupIcon(25, 25)}
          <ListItem.Content>
            <ListItem.Title style={{paddingTop: 3}}>
              <Row>
                <Text
                  weight="semibold"
                  color={Theme.Colors.settingsLabel}
                  style={{paddingRight: 10}}>
                  Backup & Restore
                </Text>
                <Text
                  style={Theme.BackupStyles.newStyles}
                  color={Theme.Colors.whiteText}>
                  New
                </Text>
              </Row>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </Pressable>

      {authenticationResponseType === Cloud.status.DECLINED && (
        // TODO: make Error UI to match mockup
        <Error
          isModal
          isVisible
          title="Permission Denied!"
          message="We noticed that you've cancelled the creation of data backup settings. We strongly recommend revisiting the data backup settings to ensure your data availability. Click “Configure Settings” to set up data backup now, or “Cancel” to go back to settings screen."
          image={SvgImage.NoInternetConnection()}
          goBack={() => {
            setAuthenticationResponseType(null);
            setShowBackAndRestoreScreen(false);
            setIsLoading(false);
            setShowConfirmation(false);
          }}
          goBackButtonVisible
          tryAgain={handleAccountSelection}
          tryAgainButtonTranslationKey="configureSettings"
          testID="CloudBackupConsentDenied"
        />
      )}

      {showBackAndRestoreScreen && (
        <BackupAndRestoreScreen
          profileInfo={profileInfo}
          onBackPress={() => {
            setShowBackAndRestoreScreen(false);
          }}
          isLoading={isSelectingAccount}
        />
      )}
      {isLoading && (
        <Modal isVisible>
          <LoaderAnimation />
        </Modal>
      )}

      {showConfirmation && (
        <AccountSelection
          isVisible={showConfirmation}
          onDismiss={() => controller.DISMISS()}
          onProceed={handleAccountSelection}
          goBack={() => setShowConfirmation(false)}
        />
      )}
    </React.Fragment>
  );
});
