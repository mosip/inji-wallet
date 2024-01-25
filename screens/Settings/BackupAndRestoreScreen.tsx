import React from 'react';
import {Image, View} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import {Button, Column, Row, Text} from '../../components/ui';
import {LoaderAnimation} from '../../components/ui/LoaderAnimation';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {SvgImage} from '../../components/ui/svg';
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
const BackupAndRestoreScreen: React.FC<BackupAndRestoreProps> = props => {
  const controller = useBackupScreen();

  const LastBackupSection = (
    <SectionLayout
      headerText={'Last Backup Details'}
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
  );
};

export default BackupAndRestoreScreen;

interface BackupAndRestoreProps {
  profileInfo: ProfileInfo | undefined;
  isLoading: boolean;
  onBackPress: () => void;
}
