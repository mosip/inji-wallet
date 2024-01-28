import React, {Fragment} from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import {Button, Centered, Column, Row, Text} from '../../components/ui';
import {LoaderAnimation} from '../../components/ui/LoaderAnimation';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {SvgImage} from '../../components/ui/svg';
import {useBackupScreen} from './BackupController';
import {MessageOverlay} from '../../components/MessageOverlay';
import {BannerNotification} from '../../components/BannerNotification';
import {SectionLayout} from '../../components/SectionLayout';
import {AccountInformation} from '../../components/AccountInformation';
import {ProfileInfo} from '../../shared/googleCloudUtils';
import {Timestamp} from '../../components/ui/Timestamp';

const BackupAndRestoreScreen: React.FC<BackupAndRestoreProps> = props => {
  const backupController = useBackupScreen();

  const LastBackupSection = (
    <SectionLayout
      headerText={
        backupController.isBackupInProgress
          ? 'Backup in progress...'
          : 'Last Backup Details'
      }
      headerIcon={SvgImage.DataBackupIcon(34, 24)}>
      <Row>
        <View style={{marginBottom: 19}}>
          {backupController.isBackupInProgress ? (
            <Text
              style={{
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: 14,
                color: Theme.Colors.helpText,
              }}>
              You can still use the application while data backup is in
              progress. Closing the app will terminate the data backup process.
            </Text>
          ) : backupController.isBackingUpSuccess ? (
            <View>
              <Row>
                {/* TODO: Fix UI of backup success content to match mockup */}
                <Column>{SvgImage.CloudUploadDoneIcon()}</Column>
                {backupController.backupFileMeta && (
                  <Column>
                    <Timestamp
                      time={backupController.backupFileMeta.backupCreationTime}
                    />
                    <Text>
                      Size: {backupController.backupFileMeta.backupFileSize}MB
                    </Text>
                  </Column>
                )}
              </Row>
            </View>
          ) : (
            <Text
              style={{
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: 14,
                color: Theme.Colors.helpText,
              }}>
              {backupController.isBackupInProgress
                ? 'You can still use the application while data backup is in progress. Closing the app will terminate the data backup process.'
                : 'Backup your Data to Google Drive. You can restore them when you reinstall INJI.'}
            </Text>
          )}
        </View>
      </Row>
      <Row style={{marginLeft: 4, marginRight: 4}}>
        {/* TODO: Button is not occupying the space in larger screens */}
        {backupController.isBackupInProgress ? (
          <Centered>
            {/* // TODO: Show Loader animation in center */}
            <LoaderAnimation showLogo={false} />
          </Centered>
        ) : (
          <Button
            testID="backup"
            type="gradient"
            title={'Backup'}
            onPress={backupController.DATA_BACKUP}
            styles={{...Theme.MessageOverlayStyles.button, flex: 1}}
          />
        )}
      </Row>
    </SectionLayout>
  );

  const AccountSection = (
    <SectionLayout
      headerText={'Google Drive Settings'}
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
        email={props.profileInfo?.email}
        picture={props.profileInfo?.picture}
      />
    </SectionLayout>
  );

  const RestoreSection = (
    <SectionLayout headerText="Restore" headerIcon={SvgImage.RestoreIcon()}>
      <Row>
        <View style={{marginBottom: 19}}>
          <Text
            style={{
              fontFamily: 'Inter',
              fontWeight: 'normal',
              fontSize: 14,
              color: Theme.Colors.helpText,
            }}>
            Restore your data from Google Drive
          </Text>
        </View>
      </Row>
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
    <Fragment>
      <Modal
        isVisible
        headerTitle={'Backup & Restore'}
        headerElevation={2}
        arrowLeft={true}
        onDismiss={props.onBackPress}>
        {backupController.isBackingUpSuccess && (
          <BannerNotification
            message="Your backup was successful!"
            onClosePress={backupController.DISMISS}
            testId="backupSuccessToast"
            customStyle={{zIndex: 1000}}
          />
        )}
        <View
          style={{
            backgroundColor: Theme.Colors.lightGreyBackgroundColor,
            flex: 1,
          }}>
          {props.isLoading ? (
            // TODO: Show Loader animation in center of screen
            <LoaderAnimation />
          ) : (
            <React.Fragment>
              {LastBackupSection}
              {AccountSection}
              {RestoreSection}
            </React.Fragment>
          )}
        </View>
      </Modal>

      <MessageOverlay
        isVisible={backupController.isBackingUpFailure}
        onButtonPress={backupController.DISMISS}
        buttonText="OK"
        title={'Backup Failed'}
      />
    </Fragment>
  );
};

export default BackupAndRestoreScreen;

interface BackupAndRestoreProps {
  profileInfo: ProfileInfo | undefined;
  isLoading: boolean;
  onBackPress: () => void;
}
