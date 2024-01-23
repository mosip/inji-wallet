import React from 'react';
import {View} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import {Button, Column, Row, Text} from '../../components/ui';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {useBackupScreen} from './BackupController';
import {SvgImage} from '../../components/ui/svg';

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

const AccountInformation: React.FC<AccountInformationProps> = ({
  associatedAccount,
  email,
}) => {
  return (
    <Row style={{marginBottom: 21, columnGap: 11}}>
      <Column align="center">
        <Icon name="person" />
      </Column>
      <Column>
        <Row>
          <Text style={{color: Theme.Colors.helpText, fontSize: 12}}>
            {associatedAccount}
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

type AccountInformationProps = {
  associatedAccount: string;
  email: string;
};

const BackupAndRestoreScreen = () => {
  const controller = useBackupScreen();
  const LastBackup = (
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
        associatedAccount={'Associated account'}
        email={'email'}
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
      onDismiss={controller.DISMISS}>
      <View style={{backgroundColor: Theme.Colors.lightGreyBackgroundColor}}>
        {LastBackup}
        {AccountSection}
        {RestoreSection}
      </View>
    </Modal>
  );
};

export default BackupAndRestoreScreen;
