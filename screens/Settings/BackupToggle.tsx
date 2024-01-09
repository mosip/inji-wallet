import React, {useState} from 'react';
import {Switch} from 'react-native-elements';
import {Text} from '../../components/ui';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {useBackupScreen} from './BackupController';

export const BackupToggle: React.FC<BackupToggleProps> = props => {
  const [dataBackup, setDataBackup] = useState(false);
  const controller = useBackupScreen(props);

  // TODO : Check if the setup is already done
  const toggleSwitch = () => {
    setDataBackup(!dataBackup);
    if (!dataBackup) {
      controller.YES();
    }
  };

  return (
    <React.Fragment>
      <Modal
        isVisible={props.isVisible}
        headerTitle={'Data Backup Toggle'}
        headerElevation={2}
        arrowLeft={true}
        onDismiss={() => {}}>
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
    </React.Fragment>
  );
};

interface BackupToggleProps {
  isVisible: boolean;
}
