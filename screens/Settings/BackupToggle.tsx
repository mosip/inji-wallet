import React, {useState} from 'react';
import {View} from 'react-native';
import {MessageOverlay} from '../../components/MessageOverlay';
import {Button, Row, Text} from '../../components/ui';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {SvgImage} from '../../components/ui/svg';
import BackupAndRestoreScreen from './BackupAndRestoreScreen';
import {useBackupScreen} from './BackupController';

export const BackupToggle: React.FC<BackupToggleProps> = props => {
  const [dataBackup, setDataBackup] = useState(false);

  const controller = useBackupScreen(props);

  const toggleSwitch = () => {
    setDataBackup(!dataBackup);
    if (!dataBackup) {
      controller.FETCH_DATA();
    }
  };

  return (
    <React.Fragment>
      <Modal
        isVisible={props.isVisible}
        headerTitle={'Data Backup Toggle'}
        headerElevation={2}
        arrowLeft={true}
        onDismiss={props.onDismiss}>
        <View style={{alignItems: 'center', paddingTop: 50}}>
          {SvgImage.DataBackupIcon(80, 100)}
        </View>

        <Text
          size="large"
          style={{
            fontWeight: 'bold',
            paddingHorizontal: 20,
            textAlign: 'center',
            paddingTop: 30,
            paddingBottom: 20,
          }}>
          You’re just a few steps away from backing up your data
        </Text>
        <Text
          size="regular"
          color={Theme.Colors.GrayText}
          style={{
            paddingHorizontal: 20,
            textAlign: 'center',
            paddingVertical: 10,
          }}>
          To initiate the data backup, please tap on the “Proceed” button to
          link your Google Drive with Inji.
        </Text>

        <Row
          style={{paddingHorizontal: 120, paddingTop: 70, paddingBottom: 250}}>
          <View>{SvgImage.GoogleDriveIcon(50, 50)}</View>
          <Text
            size="regular"
            style={{
              fontWeight: 'bold',
              paddingHorizontal: 10,
              textAlign: 'center',
              paddingTop: 15,
            }}>
            Google Drive
          </Text>
        </Row>

        <Button
          type="gradient"
          title={'Proceed'}
          onPress={() => {}}
          margin={[0, 8, 0, 0]}
        />
        <Button
          type="clear"
          title={'Go Back'}
          onPress={() => {}}
          styles={{paddingBottom: 5}}
        />
      </Modal>

      {true && <BackupAndRestoreScreen />}
      <MessageOverlay
        isVisible={controller.isBackingUpSuccess}
        onButtonPress={() => {
          controller.OK(), setDataBackup(false);
        }}
        buttonText="OK"
        title={'Backup Successful'}
      />
      <MessageOverlay
        isVisible={controller.isBackingUpFailure}
        onButtonPress={() => {
          controller.OK(), setDataBackup(false);
        }}
        buttonText="OK"
        title={'Backup Failed'}
      />
    </React.Fragment>
  );
};

interface BackupToggleProps {
  isVisible: boolean;
  onDismiss: () => void;
}
