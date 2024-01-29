import React, {Fragment} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {AccountInformation} from '../../components/AccountInformation';
import {BannerNotification} from '../../components/BannerNotification';
import {MessageOverlay} from '../../components/MessageOverlay';
import {SectionLayout} from '../../components/SectionLayout';
import {Button, Centered, Column, Row, Text} from '../../components/ui';
import {LoaderAnimation} from '../../components/ui/LoaderAnimation';
import {Modal} from '../../components/ui/Modal';
import {Timestamp} from '../../components/ui/Timestamp';
import {Theme} from '../../components/ui/styleUtils';
import {SvgImage} from '../../components/ui/svg';
import {ProfileInfo} from '../../shared/googleCloudUtils';
import {useBackupScreen} from './BackupController';
import {BackupAndRestoreAllScreenBanner} from '../../components/BackupAndRestoreAllScreenBanner';
import {useBackupRestoreScreen} from '../Settings/BackupRestoreController';

const BackupAndRestoreScreen: React.FC<BackupAndRestoreProps> = props => {
  const backupController = useBackupScreen();
  const restoreController = useBackupRestoreScreen();

  const {t} = useTranslation('BackupAndRestore');

  const Loading = (
    <Centered fill>
      <LoaderAnimation showLogo={false} />
    </Centered>
  );

  function LastBackupDetails(): React.ReactNode {
    return (
      <View>
        <Row>
          <Column>{SvgImage.CloudUploadDoneIcon()}</Column>
          {backupController.backupFileMeta && (
            <Column margin={'0 0 0 9'} align="center">
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
                Size: {backupController.backupFileMeta.backupFileSize}MB
              </Text>
            </Column>
          )}
        </Row>
      </View>
    );
  }

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
            LastBackupDetails()
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
          Loading
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
            {restoreController.isBackUpRestoring
              ? t('restoreInProgress')
              : t('restoreInfo')}
          </Text>
        </View>
      </Row>
      <Row style={{marginLeft: 1, marginRight: 1}}>
        {/* TODO: Change false to restoreInProgress */}
        {restoreController.isBackUpRestoring ? (
          Loading
        ) : (
          <Button
            testID="backup"
            type="outline"
            title={t('restore')}
            onPress={restoreController.BACKUP_RESTORE}
            styles={{...Theme.MessageOverlayStyles.button, marginTop: 10}}
          />
        )}
      </Row>
    </SectionLayout>
  );

  return (
    <Modal
      isVisible
      headerTitle={t('title')}
      headerElevation={2}
      arrowLeft={true}
      onDismiss={props.onBackPress}>
      <BackupAndRestoreAllScreenBanner />
      <View
        style={{
          backgroundColor: Theme.Colors.lightGreyBackgroundColor,
          flex: 1,
        }}>
        {props.isLoading ? (
          <Column fill align="center" crossAlign="center">
            <LoaderAnimation />
          </Column>
        ) : (
          <React.Fragment>
            {LastBackupSection}
            {AccountSection}
            {RestoreSection}
          </React.Fragment>
        )}
      </View>
    </Modal>
  );
};

export default BackupAndRestoreScreen;

interface BackupAndRestoreProps {
  profileInfo: ProfileInfo | undefined;
  isLoading: boolean;
  onBackPress: () => void;
}
