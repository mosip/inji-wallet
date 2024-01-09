import React from 'react';
import {PinInput} from '../../components/PinInput';
import {Button, Text} from '../../components/ui';
import {Modal} from '../../components/ui/Modal';
import {useSettingsScreen} from './SettingScreenController';
import {useBackupScreen} from './BackupController';

export const BackupViaPhoneNumber: React.FC<
  BackupViaPhoneNumberProps
> = props => {
  const controller = useBackupScreen(props);

  const handleEnteredPhoneNumber = (phoneNumber: string) => {
    console.log('onDOne phoneNumber');
    controller.SET_PHONE_NUMBER(phoneNumber);
  };

  return (
    <React.Fragment>
      <Modal
        isVisible={props.isVisible}
        headerTitle={'Backup via Phone Number'}
        headerElevation={2}
        arrowLeft={true}
        onDismiss={() => {}}>
        <Text style={{padding: 15}}>Verify Phone number</Text>

        <PinInput length={10} onDone={handleEnteredPhoneNumber} />
        <Button
          title={'Save Phone Number'}
          type="gradient"
          onPress={controller.SEND_OTP}
        />
      </Modal>
    </React.Fragment>
  );
};

interface BackupViaPhoneNumberProps {
  isVisible: boolean;
}
