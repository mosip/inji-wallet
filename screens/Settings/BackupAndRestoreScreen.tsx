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
import {useTranslation} from 'react-i18next';

const BackupAndRestoreScreen: React.FC<BackupAndRestoreProps> = props => {
  const backupController = useBackupScreen();
  const {t} = useTranslation('BackupAndRestore');

  const LastBackupSection = (
    <SectionLayout
      headerText={
        backupController.isBackupInProgress
          ? t('backupProgressState')
          : t('lastBackupDetails')
      }
      headerIcon={SvgImage.DataBackupIcon(34, 24)}>
      <Row>
        <View style={{marginBottom: 19}}>
          {backupController.isBackupInProgress ? (
            <Text style={Theme.BackupAndRestoreStyles.backupProgressText}>
              {t('backupInProgress')}
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
                    <Text
                      style={{
                        fontFamily: 'helvetica-neue-regular',
                        fontWeight: 'normal',
                        fontSize: 12,
                        color: '#707070',
                        lineHeight: 14,
                      }}>
                      {t('size}')}
                      {backupController.backupFileMeta.backupFileSize}MB
                    </Text>
                  </Column>
                )}
              </Row>
            </View>
          ) : (
            <Text style={Theme.BackupAndRestoreStyles.backupProgressText}>
              {backupController.isBackupInProgress
                ? t('backupInProgress')
                : t('noBackup')}
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
            title={t('backup')}
            onPress={backupController.DATA_BACKUP}
            styles={{...Theme.MessageOverlayStyles.button, flex: 1}}
          />
        )}
      </Row>
    </SectionLayout>
  );

  const AccountSection = (
    <SectionLayout
      headerText={t('driveSettings')}
      headerIcon={SvgImage.GoogleDriveIcon(28, 25)}>
      <View style={{marginBottom: 19}}>
        <Text style={Theme.BackupAndRestoreStyles.backupProgressText}>
          {t('storage')}
        </Text>
      </View>
      <AccountInformation
        email={props.profileInfo?.email}
        picture={props.profileInfo?.picture}
      />
    </SectionLayout>
  );

  const RestoreSection = (
    <SectionLayout
      headerText={t('restore')}
      headerIcon={SvgImage.RestoreIcon()}>
      <Row>
        <View style={{marginBottom: 19}}>
          <Text style={Theme.BackupAndRestoreStyles.backupProgressText}>
            {t('restoreInfo')}
            {false
              ? 'We’re restoring your data, please do not close the application. This might take upto <X> minutes based on your data.'
              : t('restoreInfo')}
          </Text>
        </View>
      </Row>
      <Row style={{marginLeft: 1, marginRight: 1}}>
        {/* TODO: Change false to restoreInProgress */}
        {false ? (
          <LoaderAnimation showLogo={false} />
        ) : (
          <Button
            testID="backup"
            type="outline"
            title={t('restore')}
            onPress={() => {}}
            styles={{...Theme.MessageOverlayStyles.button, marginTop: 10}}
          />
        )}
      </Row>
    </SectionLayout>
  );

  return (
    <Fragment>
      <Modal
        isVisible
        headerTitle={t('title')}
        headerElevation={2}
        arrowLeft={true}
        onDismiss={props.onBackPress}>
        {backupController.isBackingUpSuccess && (
          <BannerNotification
            message={t('successBanner')}
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
        buttonText={t('ok')}
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
