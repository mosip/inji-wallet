import React, {useState} from 'react';
import {Input, Text} from 'react-native-elements';
import {Button} from '../../components/ui';
import {Modal} from '../../components/ui/Modal';
import {useBackupScreen} from './BackupController';

export const BackupViaPassword: React.FC<BackupViaPasswordProps> = props => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const controller = useBackupScreen(props);
  const passwordsMatch = password === confirmPassword;

  const savePasswordAndVerify = () => {
    if (passwordsMatch) {
      // Passwords match, pass value to settings machine
      controller.SET_PASSWORD(password);
    }
  };

  return (
    <React.Fragment>
      <Modal
        isVisible={props.isVisible}
        headerTitle={'Backup via Password'}
        headerElevation={2}
        arrowLeft={true}
        onDismiss={() => {}}>
        <Text style={{padding: 15}}>Input password</Text>
        <Input onChangeText={value => setPassword(value)}></Input>

        <Text style={{padding: 15}}>Confirm password</Text>
        <Input
          onChangeText={value => {
            setConfirmPassword(value);
          }}
          errorMessage={passwordsMatch ? '' : 'Passwords do not match'}></Input>

        <Button
          title={'Save Password'}
          type="gradient"
          onPress={savePasswordAndVerify}
          disabled={!passwordsMatch}
        />
      </Modal>
    </React.Fragment>
  );
};

interface BackupViaPasswordProps {
  isVisible: boolean;
}
