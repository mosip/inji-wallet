import React from 'react';
import {Button, Text} from '../../components/ui';
import {Modal} from '../../components/ui/Modal';
import {useBackupScreen} from './BackupController';

export const BackupPreference: React.FC<BackupPreferenceProps> = props => {
  const controller = useBackupScreen(props);
  return (
    <React.Fragment>
      <Modal
        isVisible={props.isVisible}
        headerTitle={'Data Backup Preference'}
        headerElevation={2}
        arrowLeft={true}
        onDismiss={() => {}}>
        <Text> Preference </Text>

        <Button
          title={'Password'}
          type="gradient"
          onPress={controller.PASSWORD}
        />
        <Button
          title={'Phone Number'}
          type="gradient"
          onPress={controller.PHONE_NUMBER}
        />
      </Modal>
    </React.Fragment>
  );
};

interface BackupPreferenceProps {
  isVisible: boolean;
}
