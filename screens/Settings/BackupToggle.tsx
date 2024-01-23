import React, {useEffect, useState} from 'react';
import {MessageOverlay} from '../../components/MessageOverlay';
import {Button, Text} from '../../components/ui';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {useBackupScreen} from './BackupController';
import BackupAndRestoreScreen from './BackupAndRestoreScreen';

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
        <Text> Enable Data backup</Text>
        <Text> You’re just a few steps away from backing up your data</Text>

        <Button
          testID="cancel"
          type="gradient"
          title={'proceed'}
          onPress={() => {}}
          styles={Theme.MessageOverlayStyles.button}
        />
        <Button
          testID="cancel"
          type="solid"
          title={'go back'}
          onPress={() => {}}
          styles={Theme.MessageOverlayStyles.button}
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
