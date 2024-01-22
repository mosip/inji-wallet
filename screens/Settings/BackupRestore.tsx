import React, {useState} from 'react';
import {Pressable} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import {Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {useBackupRestoreScreen} from './BackupRestoreController';
import {BackupRestoreToggle} from './BackupRestoreToggle';

export const BackupRestore: React.FC = ({} = props => {
  const controller = useBackupRestoreScreen(props);

  // TODO : Check if the setup is already done

  return (
    <React.Fragment>
      <Pressable
        onPress={() => {
          controller.BACKUP_RESTORE();
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
                Backup Restore
              </Text>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </Pressable>

      {controller.isBackUpRestoring && (
        <BackupRestoreToggle
          isVisible={controller.isBackUpRestoring}
          onDismiss={() => {}}
        />
      )}
    </React.Fragment>
  );
});
