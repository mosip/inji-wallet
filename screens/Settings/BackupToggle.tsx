import React, {useState} from 'react';
import {Switch} from 'react-native-elements';
import {Text} from '../../components/ui';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {useBackupScreen} from './BackupController';
import {Platform} from 'react-native';
import {MessageOverlay} from '../../components/MessageOverlay';

export const BackupToggle: React.FC<BackupToggleProps> = props => {
  const [dataBackup, setDataBackup] = useState(false);

  const controller = useBackupScreen(props);

  // TODO : Check if the setup is already done
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
        <Text> Enable Data backup</Text>
        <Switch
          value={dataBackup}
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
