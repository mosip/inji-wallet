import React, {useState} from 'react';
import {Switch} from 'react-native-elements';
import {Text} from '../../components/ui';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {useBackupRestoreScreen} from './BackupRestoreController';
import {Platform} from 'react-native';
import {MessageOverlay} from '../../components/MessageOverlay';

export const BackupRestoreToggle: React.FC<BackupToggleProps> = props => {
  const [dataBackupRetore, setDataBackupRestore] = useState(false);

  const controller = useBackupRestoreScreen();

  const toggleSwitch = () => {
    setDataBackupRestore(!dataBackupRetore);
    if (!dataBackupRetore) {
      controller.EXTRACT_DATA();
    }
  };

  return (
    <React.Fragment>
      <Modal
        isVisible={props.isVisible}
        headerTitle={'Backup Restore Toggle'}
        headerElevation={2}
        arrowLeft={true}
        onDismiss={props.onDismiss}>
        <Text> Restore Backup</Text>
        <Switch
          value={dataBackupRetore}
          onValueChange={toggleSwitch}
          trackColor={{
            false: Theme.Colors.switchTrackFalse,
            true:
              Platform.OS == 'ios'
                ? Theme.Colors.switchHead
                : Theme.Colors.switchTrackTrue,
          }}
          color={Theme.Colors.switchHead}
        />
      </Modal>
      <MessageOverlay
        isVisible={controller.isBackUpRestoreSuccess}
        onButtonPress={() => {
          controller.OK(), setDataBackupRestore(false);
        }}
        buttonText="OK"
        title={'Backup Restoration Successful'}
      />
      <MessageOverlay
        isVisible={controller.isBackUpRestoreFailure}
        onButtonPress={() => {
          controller.OK(), setDataBackupRestore(false);
        }}
        buttonText="OK"
        title={'Backup Restoration Failed'}
      />
    </React.Fragment>
  );
};

interface BackupToggleProps {
  isVisible: boolean;
  onDismiss: () => void;
}
