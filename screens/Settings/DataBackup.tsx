import React, {useState} from 'react';
import {Pressable} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import {Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {useBackupScreen} from './BackupController';
import {BackupToggle} from './BackupToggle';

export const DataBackup: React.FC = ({} = props => {
  const controller = useBackupScreen(props);

  // TODO : Check if the setup is already done

  return (
    <React.Fragment>
      <Pressable
        onPress={() => {
          controller.DATA_BACKUP();
        }}>
        <ListItem topDivider bottomDivider>
          <Icon
            type={'feather'}
            name={'file'}
            color={Theme.Colors.Icon}
            size={25}
          />
          <ListItem.Content>
            <ListItem.Title style={{paddingTop: 3}}>
              <Text weight="semibold" color={Theme.Colors.settingsLabel}>
                Data Backup
              </Text>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </Pressable>

      {controller.isBackingUp && (
        <BackupToggle
          isVisible={controller.isBackingUp}
          onDismiss={() => controller.DISMISS()}
        />
      )}

      {/* TODO: refactor OtpVerificationModal to accept different machines */}
      {/*       {controller.isRequestOtp && (
        <OtpVerificationModal
          service={backupMachine}
          onInputDone={controller.INPUT_OTP}
          isVisible={controller.isRequestOtp}
        />
      )} */}

      {/* TODO: move the MessageOverlay to the OtpVerificationModal and BackupViaPassord screen once the backing up is started */}
      {/* {controller.isBackingUp && (
        <MessageOverlay
          isVisible={controller.isBackingUp}
          title={'Backing up'}
        />
      )} */}
    </React.Fragment>
  );
});
