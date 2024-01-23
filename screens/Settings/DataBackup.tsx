import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import {Row, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {useBackupScreen} from './BackupController';
import {BackupToggle} from './BackupToggle';
import {SvgImage} from '../../components/ui/svg';

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
          {SvgImage.DataBackupIcon()}
          <ListItem.Content>
            <ListItem.Title style={{paddingTop: 3}}>
              <Row>
                <Text
                  weight="semibold"
                  color={Theme.Colors.settingsLabel}
                  style={{paddingRight: 10}}>
                  Backup & Restore
                </Text>
                <Text
                  style={Theme.BackupStyles.newStyles}
                  color={Theme.Colors.whiteText}>
                  New
                </Text>
              </Row>
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
    </React.Fragment>
  );
});
