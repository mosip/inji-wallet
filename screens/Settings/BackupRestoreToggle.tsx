import React, {useState} from 'react';
import {Switch} from 'react-native-elements';
import {Text} from '../../components/ui';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {useBackupScreen} from './BackupController';
import {Platform} from 'react-native';
import {MessageOverlay} from '../../components/MessageOverlay';

export const BackupRestoreToggle: React.FC<BackupToggleProps> = props => {
  const controller = useBackupScreen(props);

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
          value={}
          onValueChange={}
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
  onDismiss: () => void;
}
