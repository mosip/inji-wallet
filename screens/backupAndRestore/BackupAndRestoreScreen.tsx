import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
import {AccountInformation} from '../../components/AccountInformation';
import {SectionLayout} from '../../components/SectionLayout';
import {Button, Centered, Column, Row, Text} from '../../components/ui';
import {LoaderAnimation} from '../../components/ui/LoaderAnimation';
import {Modal} from '../../components/ui/Modal';
import {Timestamp} from '../../components/ui/Timestamp';
import {Theme} from '../../components/ui/styleUtils';
import {SvgImage} from '../../components/ui/svg';
import {ProfileInfo} from '../../shared/googleCloudUtils';
import {useBackupScreen} from './BackupController';
import {BannerNotificationContainer} from '../../components/BannerNotificationContainer';
import {useBackupRestoreScreen} from '../Settings/BackupRestoreController';
import {Icon} from 'react-native-elements';
import testIDProps from '../../shared/commonUtil';
import {HelpScreen} from '../../components/HelpScreen';

const BackupAndRestoreScreen: React.FC<BackupAndRestoreProps> = props => {
  const backupController = useBackupScreen();
  const restoreController = useBackupRestoreScreen();

  const {t} = useTranslation('BackupAndRestore');

  useEffect(() => {
    if (!props.isLoading) {
      backupController.LAST_BACKUP_DETAILS();
    }
  }, [props.isLoading]);

  const Loading = (
    <Centered fill>
      <LoaderAnimation showLogo={false} />
    </Centered>
  );

  function LastBackupDetails(): React.ReactNode {
    return (
      <View>
        {backupController.lastBackupDetails && (
          <Row>
            <Column>{SvgImage.CloudUploadDoneIcon()}</Column>
            <Column margin={'0 0 0 9'} align="center">
              <Timestamp
                testId="lastBackup"
                time={backupController.lastBackupDetails.backupCreationTime}
              />
              <Text
                testID="lastBackupSize"
                style={{
                  fontFamily: 'helvetica-neue-regular',
                  fontWeight: 'normal',
                  fontSize: 12,
                  color: '#707070',
                  lineHeight: 14,
                }}>
                {t('size')}
                {backupController.lastBackupDetails.backupFileSize}MB
              </Text>
            </Column>
          </Row>
        )}
      </View>
    );
  }

  const LastBackupSection = (
    <SectionLayout
      testId="LastBackupSection"
      headerText={
        backupController.isBackupInProgress
          ? t('backupProgressState')
          : t('lastBackupDetails')
      }
      headerIcon={SvgImage.DataBackupIcon(34, 24)}>
      <Row>
        <View style={{marginBottom: 19}}>
          {backupController.isBackupInProgress ? (
            <Text
              testID="backupInProgress"
              style={Theme.BackupAndRestoreStyles.backupProgressText}>
              {t('backupInProgress')}
            </Text>
          ) : backupController.lastBackupDetails ? (
            LastBackupDetails()
          ) : (
            <Text
              testID="noBackup"
              style={Theme.BackupAndRestoreStyles.backupProgressText}>
              {t('noBackup')}
            </Text>
          )}
        </View>
      </Row>
      <Row style={Theme.BackupAndRestoreStyles.actionOrLoaderContainer}>
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
      testId="AccountSection"
      headerText={t('driveSettings')}
      headerIcon={SvgImage.GoogleDriveIcon(28, 25)}>
      <View style={{marginBottom: 19}}>
        <Text
          testID="storageInfo"
          style={Theme.BackupAndRestoreStyles.backupProgressText}>
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
      testId="restoreSection"
      headerText={t('restore')}
      headerIcon={SvgImage.RestoreIcon()}
      marginBottom={16}>
      <Row>
        <View style={{marginBottom: 19}}>
          <Text
            style={Theme.BackupAndRestoreStyles.backupProgressText}
            testID={
              restoreController.isBackUpRestoring
                ? 'restoreInProgress'
                : 'restoreInfo'
            }>
            {restoreController.isBackUpRestoring
              ? t('restoreInProgress')
              : t('restoreInfo')}
          </Text>
        </View>
      </Row>
      <Row style={Theme.BackupAndRestoreStyles.actionOrLoaderContainer}>
        {restoreController.isBackUpRestoring ? (
          Loading
        ) : (
          <Button
            testID="restore"
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
      testID="backupAndRestore"
      headerElevation={2}
      arrowLeft={true}
      headerRight={
        <HelpScreen
          source={'BackUp'}
          triggerComponent={
            <Icon
              {...testIDProps('help')}
              accessible={true}
              name="question"
              type="font-awesome"
              size={21}
              style={Theme.Styles.IconContainer}
              color={Theme.Colors.Icon}
            />
          }
        />
      }
      onDismiss={props.onBackPress}>
      <BannerNotificationContainer />
      <View
        style={{
          backgroundColor: Theme.Colors.lightGreyBackgroundColor,
          flex: 1,
        }}>
        {props.isLoading || backupController.isLoading ? (
          <Column fill align="center" crossAlign="center">
            <LoaderAnimation />
          </Column>
        ) : (
          <ScrollView>
            {LastBackupSection}
            {AccountSection}
            {RestoreSection}
          </ScrollView>
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
